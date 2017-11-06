<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.type" placeholder="类型"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.description" placeholder="描述"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getDicts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dicts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="value" label="键值" width="120" sortable>
			</el-table-column>
			<el-table-column prop="label" label="标签" width="100" sortable>
			</el-table-column>
			<el-table-column prop="type" label="类型" width="100" sortable>
			</el-table-column>
			<el-table-column prop="description" label="描述" width="120" sortable>
			</el-table-column>
			<el-table-column prop="order" label="排序" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, sizes, prev, pager, next, jumper" 
			@current-change="handleCurrentChange" 
			@size-change="pageSizeChange"
			:page-size="filters.per_page"
			:total="total" 
			style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="键值" prop="value">
					<el-input v-model="editForm.value" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="标签" prop="label">
					<el-input v-model="editForm.label" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-input v-model="editForm.type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="editForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editForm.order" :min="0" :max="999"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.remarks"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="键值" prop="value">
					<el-input v-model="addForm.value" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="标签" prop="label">
					<el-input v-model="addForm.label" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-input v-model="addForm.type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="addForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addForm.order" :min="0" :max="999"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="addForm.remarks"></el-input>
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
	//import NProgress from 'nprogress'
	import { getDictListPage, removeDict, batchRemoveDict, editDict, addDict } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
					per_page: 10
				},
				dicts: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					value: [
						{ required: true, message: '请输入键值', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					value: 0,
					label: '',
					type: '',
					description: '',
					order: 0,
					remarks: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					value: [
						{ required: true, message: '请输入键值', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					value: 0,
					label: '',
					type: '',
					description: '',
					order: 0,
					remarks: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getDicts();
			},
			pageSizeChange(val) {
				this.filters.per_page = val;
				this.getDicts();
			},
			//获取用户列表
			getDicts() {
				let para = {
					page: this.page,
					pageSize: this.filters.per_page,
					type: this.filters.type,
					description: this.filters.description
				};
				this.listLoading = true;
				//NProgress.start();
				getDictListPage(para).then((res) => {
					this.total = res.data.total;
					this.dicts = res.data.dicts;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getDicts();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					value: 0,
					label: '',
					type: '',
					description: '',
					order: 0,
					remarks: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							editDict(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getDicts();
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
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							addDict(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getDicts();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveDicts(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getDicts();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getDicts();
		}
	}

</script>

<style scoped>

</style>