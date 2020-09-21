<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getNews">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="newsList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="id" width="60">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="100" sortable>
			</el-table-column>
			<el-table-column prop="content" label="简介" min="400" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, sizes, prev, pager, next, jumper"
						   @size-change="handleSizeChange"
						   @current-change="handleCurrentChange"
						   :page-sizes="[10, 20, 50]"
						   :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="news" label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="标题" prop="title">
						<el-input v-model="news.title" auto-complete="off"></el-input>
					</el-form-item>
				<el-form-item label="内容"  prop="content">
					<el-input  type="textarea"
							   :rows="6"
							   placeholder="请输入内容" v-model="news.content" auto-complete="off"></el-input>
				</el-form-item>

				</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="news" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="news.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="内容"  prop="content">
					<el-input  type="textarea"
							   :rows="6"
							   placeholder="请输入内容" v-model="news.content" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getNewsPage, removeNews, saveNews } from '../../api/api';
	export default {
		data() {
			return {
				filters: {
					title: ''
				},
				newsList: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},
				//编辑界面数据
				news: {
					id: 0,
					title: '',
					content: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getNews();
			},
			handleSizeChange(val){
				this.pageSize = val;
				this.getNews();
			},
			//获取用户列表
			getNews() {
				let para = {
					page: this.page,
					pageSize:this.pageSize,
					title: this.filters.title
				};
				this.listLoading = true;
				getNewsPage(para).then((res) => {
					console.info(res)
					this.total = res.data.data.totalElements;
					this.newsList = res.data.data.content;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { newsId: row.id ,status:3};
					removeNews(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getNews();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.news = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.news={
					id: 0,
							title: '',
							content: ''
				},
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.news);
							saveNews(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.getNews();
							});
						});
					}
				});


			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.news);
							saveNews(JSON.stringify(para)).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.addFormVisible = false;
								this.getNews();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getNews();
		}
	}

</script>

<style scoped>

</style>