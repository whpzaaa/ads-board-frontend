<template>
  <div>
    <h1>广告看板</h1>
    <button @click="showAddForm = true">添加广告</button>

    <!-- 添加广告表单 -->
    <div v-if="showAddForm">
      <h2>添加广告</h2>
      <form @submit.prevent="addAdvertisement">
        <input v-model="newAd.title" placeholder="标题" required />
        <input v-model="newAd.address" placeholder="地址" required />
        <textarea v-model="newAd.description" placeholder="描述"></textarea>
        <input v-model.number="newAd.bedroomCount" type="number" placeholder="卧室数量" min="1" required />
        <input v-model.number="newAd.bathroomCount" type="number" placeholder="浴室数量" min="1" required />
        <input v-model.number="newAd.price" type="number" step="0.01" placeholder="价格" min="0" required />
        <input type="checkbox" v-model="newAd.isAvailable" /> 可用
        <!-- 文件上传输入框 -->
        <input type="file" multiple @change="handleFileChange" />
        <button type="submit">提交</button>
        <button @click="showAddForm = false">取消</button>
      </form>
    </div>

    <!-- 广告列表 -->
    <ul>
      <li v-for="ad in advertisements" :key="ad.adId" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
        <h3>{{ ad.title }}</h3> 
        <p>{{ ad.address }}</p>
        <p>{{ ad.description }}</p>
        <p>卧室数量: {{ ad.bedroomCount }}</p>
        <p>浴室数量: {{ ad.bathroomCount }}</p>
        <p>价格: {{ ad.price }}</p>
        <p>是否可用: {{ ad.isAvailable ? '是' : '否' }}</p>
        <p>创建时间: {{ formatDate(ad.createdAt) }}</p>
        <p>更新时间: {{ formatDate(ad.updatedAt) }}</p>
        <!-- 展示广告关联的图片 -->
        <div v-if="ad.images && ad.images.length > 0">
          <h4>广告图片</h4>
          <div v-for="(image, index) in ad.images" :key="image.imageId">
            <img :src="image.filePath" :alt="'广告 ' + ad.adId + ' 的图片 ' + (index + 1)" style="max-width: 200px; max-height: 200px;">
            <button @click="deleteImage(ad.adId, image.imageId, index)">删除</button>
            <button @click="downloadImage(image.filePath, image.fileName)">下载</button>
          </div>
        </div>
        <button @click="editAd = { ...ad, newFiles: [] }">编辑</button>
        <button @click="deleteAdvertisement(ad.adId)">删除</button>
      </li>
    </ul>

    <!-- 分页组件 -->
    <div>
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>当前页: {{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage * pageSize >= total">下一页</button>
    </div>

    <!-- 编辑广告表单 -->
    <div v-if="editAd">
      <h2>编辑广告</h2>
      <form @submit.prevent="updateAdvertisement">
        <input v-model="editAd.title" placeholder="标题" required />
        <input v-model="editAd.address" placeholder="地址" required />
        <textarea v-model="editAd.description" placeholder="描述"></textarea>
        <input v-model.number="editAd.bedroomCount" type="number" placeholder="卧室数量" min="1" required />
        <input v-model.number="editAd.bathroomCount" type="number" placeholder="浴室数量" min="1" required />
        <input v-model.number="editAd.price" type="number" step="0.01" placeholder="价格" min="0" required />
        <input type="checkbox" v-model="editAd.isAvailable" /> 可用
        <!-- 展示已有的图片 -->
        <div v-if="editAd.images && editAd.images.length > 0">
          <h4>已有图片</h4>
          <div v-for="(image, index) in editAd.images" :key="image.imageId">
            <img :src="image.filePath" :alt="'广告 ' + editAd.adId + ' 的图片 ' + (index + 1)" style="max-width: 200px; max-height: 200px;">
            <button @click="removeImageFromEdit(index)">删除</button>
            <button @click="downloadImage(image.filePath, image.fileName)">下载</button>
          </div>
        </div>
        <!-- 上传新图片 -->
        <input type="file" multiple @change="handleEditFileChange" />
        <button type="submit">保存</button>
        <button @click="editAd = null">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      advertisements: [],
      showAddForm: false,
      newAd: {
        userId: 1, // 添加 userId 字段并初始化为 1
        title: '',
        address: '',
        description: '',
        bedroomCount: 1,
        bathroomCount: 1,
        price: 0,
        isAvailable: true,
        images: []
      },
      editAd: null,
      currentPage: 1,
      pageSize: 2,
      total: 0,
      selectedFiles: [] // 存储用户选择的文件
    };
  },
  mounted() {
    this.fetchAdvertisements();
  },
  methods: {
    async fetchAdvertisements() {
      try {
        const response = await axios.get('http://localhost:8080/api/ads', {
          params: {
            page: this.currentPage - 1,
            pageSize: this.pageSize
          }
        });
        this.advertisements = response.data.records;
        this.total = response.data.total;
        console.log('获取到的广告数据:', this.advertisements); 
      } catch (error) {
        console.error('获取广告列表失败', error);
      }
    },
    handleFileChange(event) {
      this.selectedFiles = Array.from(event.target.files);
    },
    handleEditFileChange(event) {
      this.editAd.newFiles = Array.from(event.target.files);
    },
    async addAdvertisement() {
      try {
        const adResponse = await axios.post('http://localhost:8080/api/ads', this.newAd);
        const newAdId = adResponse.data.adId;

        for (const file of this.selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('adId', newAdId);
          formData.append('displayOrder', 0); 
          formData.append('isPrimary', false); 

          const imageResponse = await axios.post('http://localhost:8080/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (imageResponse.status === 201) {
            this.newAd.images.push(imageResponse.data);
          }
        }

        this.advertisements.push({ ...adResponse.data, images: this.newAd.images });
        this.showAddForm = false;
        this.newAd = {
          userId: 1,
          title: '',
          address: '',
          description: '',
          bedroomCount: 1,
          bathroomCount: 1,
          price: 0,
          isAvailable: true,
          images: []
        };
        this.selectedFiles = [];
        this.fetchAdvertisements(); 
      } catch (error) {
        console.error('添加广告失败', error);
      }
    },
    async updateAdvertisement() {
      try {
        // 更新广告基本信息
        await axios.put(`http://localhost:8080/api/ads/${this.editAd.adId}`, this.editAd);

        // 删除标记要删除的图片
        const imagesToDelete = this.editAd.images.filter(image => image._toDelete);
        for (const image of imagesToDelete) {
          await axios.delete(`http://localhost:8080/api/images/${image.imageId}`);
        }
        this.editAd.images = this.editAd.images.filter(image => !image._toDelete);

        // 上传新图片
        for (const file of this.editAd.newFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('adId', this.editAd.adId);
          formData.append('displayOrder', 0); 
          formData.append('isPrimary', false); 

          const imageResponse = await axios.post('http://localhost:8080/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (imageResponse.status === 201) {
            this.editAd.images.push(imageResponse.data);
          }
        }

        await this.fetchAdvertisements(); 
        this.editAd = null;
      } catch (error) {
        console.error('更新广告失败', error);
      }
    },
    async deleteAdvertisement(id) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/ads/${id}`);
        if (response.data === '删除成功') {
          await this.fetchAdvertisements(); 
        }
      } catch (error) {
        console.error('删除广告失败', error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
      const year = d.getFullYear();

      if (month.length < 2) {
        month = `0${month}`;
      }
      if (day.length < 2) {
        day = `0${day}`;
      }

      return [year, month, day].join('-');
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchAdvertisements();
      }
    },
    nextPage() {
      if (this.currentPage * this.pageSize < this.total) {
        this.currentPage++;
        this.fetchAdvertisements();
      }
    },
    removeImageFromEdit(index) {
      // 标记图片为要删除
      this.editAd.images[index]._toDelete = true;
      // 从显示列表中移除
      this.editAd.images.splice(index, 1);
    },
    async deleteImage(adId, imageId, index) {
      try {
        await axios.delete(`http://localhost:8080/api/images/${imageId}`);
        this.advertisements.find(ad => ad.adId === adId).images.splice(index, 1);
      } catch (error) {
        console.error('删除图片失败', error);
      }
    },
    async downloadImage(filePath, fileName) {
      try {
        const response = await axios.get(filePath, {
          responseType: 'blob' // 以二进制形式接收响应
        });

        // 创建一个 Blob 对象
        const blob = new Blob([response.data]);
        // 创建一个 URL 对象
        const url = window.URL.createObjectURL(blob);
        // 创建一个 <a> 元素
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // 设置下载的文件名
        // 将 <a> 元素添加到文档中
        document.body.appendChild(link);
        // 模拟点击 <a> 元素触发下载
        link.click();
        // 移除 <a> 元素
        document.body.removeChild(link);
        // 释放 URL 对象
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('下载图片失败', error);
      }
    }
  }
};
</script>
