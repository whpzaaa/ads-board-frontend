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
        <!-- 文件上传控件 -->
        <input type="file" multiple @change="handleFileChange" />
        <button type="submit">提交</button>
        <button @click="showAddForm = false">取消</button>
      </form>
    </div>

    <!-- 广告列表 -->
    <ul>
      <li v-for="ad in advertisements" :key="ad.adId" class="ad-item">
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
        <div>
          <h4>广告图片</h4>
          <div v-for="image in ad.images" :key="image.imageId">
            <!-- 假设 filePath 是图片的完整访问路径 -->
            <img :src="image.filePath" :alt="image.fileName" style="max-width: 200px; max-height: 200px;">
            <p>{{ image.fileName }}</p>
            <a :href="image.filePath" :download="image.fileName">下载</a>
          </div>
        </div>
        <button @click="editAd = ad">编辑</button>
        <button @click="deleteAdvertisement(ad.adId)">删除</button>
      </li>
    </ul>

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
        <!-- 文件上传控件 -->
        <input type="file" multiple @change="handleEditFileChange" />
        <!-- 显示已有的图片 -->
        <div class="image-container">
          <h4>已有图片</h4>
          <div class="image-list">
            <div v-for="(image, index) in editAd.images" :key="image.imageId" class="image-item">
              <img :src="image.filePath" :alt="image.fileName" class="image">
              <p>{{ image.fileName }}</p>
              <a :href="image.filePath" :download="image.fileName">下载</a>
              <button @click="deleteEditImage(index)">删除</button>
            </div>
          </div>
        </div>
        <button type="submit">保存</button>
        <button @click="editAd = null">取消</button>
      </form>
    </div>

    <!-- 分页控件 -->
    <div>
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
      <span>当前第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === Math.ceil(total / pageSize)">下一页</button>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      advertisements: [],
      showAddForm: false,
      newAd: {
        title: '',
        address: '',
        description: '',
        bedroomCount: 1,
        bathroomCount: 1,
        price: 0,
        isAvailable: true
      },
      editAd: null,
      currentPage: 1,
      pageSize: 2,
      total: 0,
      selectedFiles: [],
      editSelectedFiles: []
    };
  },
  mounted() {
    this.fetchAdvertisements();
  },
  methods: {
    async fetchAdvertisements() {
      try {
        // 传递 page 和 pageSize 参数
        const response = await api.get('/api/ads', {
          params: {
            page: this.currentPage - 1, // 假设后端页码从 0 开始
            pageSize: this.pageSize
          }
        });
        this.advertisements = response.records;
        this.total = response.total;
      } catch (error) {
        console.error('获取广告列表失败', error);
      }
    },
    // 处理文件选择事件
    handleFileChange(event) {
      this.selectedFiles = Array.from(event.target.files);
    },
    async addAdvertisement() {
      try {
        // 先创建广告
        const adResponse = await api.post('/api/ads', this.newAd);
        const adId = adResponse.adId;

        // 上传图片
        for (let i = 0; i < this.selectedFiles.length; i++) {
          const file = this.selectedFiles[i];
          const formData = new FormData();
          formData.append('file', file);
          formData.append('adId', adId);
          formData.append('displayOrder', i);
          formData.append('isPrimary', i === 0); // 假设第一张图片为主图

          await api.post('/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        // 重新获取广告列表
        this.fetchAdvertisements();
        this.showAddForm = false;
        this.newAd = {
          title: '',
          address: '',
          description: '',
          bedroomCount: 1,
          bathroomCount: 1,
          price: 0,
          isAvailable: true
        };
        this.selectedFiles = []; // 清空选择的文件
      } catch (error) {
        console.error('添加广告或上传图片失败', error);
      }
    },
    // 处理编辑时的文件选择事件
    handleEditFileChange(event) {
      this.editSelectedFiles = Array.from(event.target.files);
    },
    // 删除编辑时的图片
    async deleteEditImage(index) {
      const imageToDelete = this.editAd.images[index];
      try {
        // 向后端发送删除请求
        const response = await api.delete(`/api/images/${imageToDelete.imageId}`);
        if (response === '删除成功') {
          // 从本地数据中移除该图片
          this.editAd.images.splice(index, 1);
          alert('图片删除成功');
        } else {
          alert('图片删除失败，请稍后重试');
        }
      } catch (error) {
        console.error('删除图片时出错:', error);
        alert('删除图片时出错，请稍后重试');
      }
    },
    async updateAdvertisement() {
      try {
        // 先更新广告信息
        const response = await api.put(`/api/ads/${this.editAd.adId}`, this.editAd);
        if (response === '更新成功') {
          // 上传新选择的图片
          for (let i = 0; i < this.editSelectedFiles.length; i++) {
            const file = this.editSelectedFiles[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('adId', this.editAd.adId);
            formData.append('displayOrder', i);
            formData.append('isPrimary', i === 0); // 假设第一张图片为主图

            await api.post('/api/images/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          }
          // 重新获取广告列表
          this.fetchAdvertisements();
          this.editAd = null;
          this.editSelectedFiles = [];
        }
      } catch (error) {
        console.error('更新广告失败', error);
      }
    },
    async deleteAdvertisement(id) {
      try {
        const response = await api.delete(`/api/ads/${id}`);
        if (response === '删除成功') {
          this.advertisements = this.advertisements.filter(ad => ad.adId !== id);
          // 删除成功后重新获取数据
          this.fetchAdvertisements(); 
        }
      } catch (error) {
        console.error('删除广告失败', error);
      }
    },
    formatDate(dateArray) {
      if (!Array.isArray(dateArray) || dateArray.length < 6) {
        return '无效日期';
      }
      // 月份需要减 1，因为 Date 构造函数中月份从 0 开始
      const [year, month, day, hour, minute, second] = dateArray;
      const date = new Date(year, month - 1, day, hour, minute, second);
      if (isNaN(date.getTime())) {
        return '无效日期';
      }
      return date.toLocaleString();
    },
    changePage(page) {
      if (page >= 1 && page <= Math.ceil(this.total / this.pageSize)) {
        this.currentPage = page;
        this.fetchAdvertisements();
      }
    }
  }
};
</script>

<style scoped>
.ad-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-container {
  margin-top: 10px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.image {
  /* 调整图片的最大宽度和最大高度 */
  max-width: 150px; 
  max-height: 150px; 
}
</style>