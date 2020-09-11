<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getMissions">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="missions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="id" width="60">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="100" sortable>
			</el-table-column>
			<el-table-column prop="content" label="内容" width="200"  sortable>
			</el-table-column>
			<el-table-column prop="integral" label="积分" width="100" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="联系方式" width="150" sortable>
			</el-table-column>
			<el-table-column prop="createByUser.name" label="创建者" min-width="150" sortable>
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
			<el-form :model="mission" label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="标题" prop="title">
						<el-input v-model="mission.title" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="内容" prop="content">
						<el-input  type="textarea"
								   :rows="4"
								   placeholder="请输入内容" v-model="mission.content" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="phone">
						<el-input v-model="mission.phone" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="悬赏积分">
						<el-input  v-model="mission.integral"></el-input>
					</el-form-item>
				</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="mission" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="mission.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input  type="textarea"
							   :rows="4"
							   placeholder="请输入内容" v-model="mission.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="mission.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="悬赏积分">
					<el-input  v-model="mission.integral"></el-input>
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
	import util from '../../common/js/util'
	import { getMissionPage, removeMission, saveMission } from '../../api/api';
	export default {
		data() {
			return {
				filters: {
					title: ''
				},
				missions: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				},
				//编辑界面数据
				mission: {
					id: 0,
					title: '',
					content: '',
					integral: 0,
					phone:'',
					createByUser:{id:0}
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
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
				this.getMissions();
			},
			handleSizeChange(val){
				this.pageSize = val;
				this.getMissions();
			},
			//获取用户列表
			getMissions() {
				let para = {
					page: this.page,
					pageSize:this.pageSize,
					title: this.filters.title
				};
				this.listLoading = true;
				getMissionPage(para).then((res) => {
					console.info(res)
					this.total = res.data.data.totalElements;
					this.missions = res.data.data.content;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { missionId: row.id ,status:3};
					removeMission(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getMissions();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.mission = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.mission={
					id: 0,
							title: '',
							content: '',
							integral: 0,
							phone:'',
							createByUser:{}
				},
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {

				let user = sessionStorage.getItem('user');
				user = JSON.parse(user);
				if(user.id!=this.mission.createByUser.id){
					this.$message({
						message: '无权修改',
						type: 'warning'
					});
				}else{
					this.$refs.editForm.validate((valid) => {
						if (valid) {
							this.$confirm('确认提交吗？', '提示', {}).then(() => {
								this.editLoading = true;
								let para = Object.assign({}, this.user);
								para.birthday = (!para.birthday || para.birthday == '') ? '' : util.formatDate.format(new Date(para.birthday), 'yyyy-MM-dd');
								saveMission(para).then((res) => {
									this.editLoading = false;
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.editFormVisible = false;
									this.getMissions();
								});
							});
						}
					});
				}

			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let user = sessionStorage.getItem('user');
							user = JSON.parse(user);
							this.mission.createByUser=user;
							let para = Object.assign({}, this.mission);
							saveMission(JSON.stringify(para)).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.addFormVisible = false;
								this.getMissions();
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
			this.getMissions();
		}
	}

</script>

<style scoped>

</style>