<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getGift">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="gifts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="id" width="60">
			</el-table-column>
			<el-table-column prop="name" label="名称" width="100" sortable>
			</el-table-column>
			<el-table-column prop="content" label="简介" width="200" sortable>
			</el-table-column>
			<el-table-column prop="num" label="库存" width="100" sortable>
			</el-table-column>
			<el-table-column prop="integral" label="积分" min-width="100" sortable>
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
			<el-form :model="gift" label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="名称" prop="name">
						<el-input v-model="gift.name" auto-complete="off"></el-input>
					</el-form-item>
				<el-form-item label="简介" >
					<el-input  type="textarea"
							   :rows="4"
							   placeholder="请输入内容" v-model="gift.content" auto-complete="off"></el-input>
				</el-form-item>
					<el-form-item label="库存">
						<el-input v-model="gift.num" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="积分">
						<el-input  v-model="gift.integral"></el-input>
					</el-form-item>
				</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="gift" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="gift.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="库存" >
					<el-input v-model="gift.num" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简介" >
					<el-input  type="textarea"
							   :rows="4"
							   placeholder="请输入内容" v-model="gift.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="积分" >
					<el-input  v-model="gift.integral"></el-input>
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
	import { getGiftPage, removeGift, saveGift } from '../../api/api';
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				gifts: [],
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
				},
				//编辑界面数据
				gift: {
					id: 0,
					name: '',
					num: 0,
					integral: 0,
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					integral: [
						{ required: true, message: '请输入积分', trigger: 'blur' }
					]
				},

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getGift();
			},
			handleSizeChange(val){
				this.pageSize = val;
				this.getGift();
			},
			//获取用户列表
			getGift() {
				let para = {
					page: this.page,
					pageSize:this.pageSize,
					name: this.filters.name
				};
				this.listLoading = true;
				getGiftPage(para).then((res) => {
					console.info(res)
					this.total = res.data.data.totalElements;
					this.gifts = res.data.data.content;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { giftId: row.id ,status:3};
					removeGift(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getGift();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.gift = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.gift={
					id: 0,
							name: '',
							content: '',
							integral: 0,
							num:0
				},
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.gift);
							saveGift(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.getGift();
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
							let para = Object.assign({}, this.gift);
							saveGift(JSON.stringify(para)).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.addFormVisible = false;
								this.getGift();
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
			this.getGift();
		}
	}

</script>

<style scoped>

</style>