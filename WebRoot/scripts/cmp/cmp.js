// / <reference path="/scripts/cmp/cmp.js"/>

(function() {
	var act_grp_1 = [{
				text : 'New',
				icon : 'styles/cmp/images/icon-new.png'
			}, {
				text : 'Delete',
				icon : 'styles/cmp/images/icon-delete.png'
			}, {
				text : 'Save As',
				icon : 'styles/cmp/images/icon-save-as.png'
			}];

	var act_grp_2 = [{
				text : 'New',
				icon : 'styles/cmp/images/icon-new.png'
			}, {
				text : 'Delete',
				icon : 'styles/cmp/images/icon-delete.png'
			}, {
				text : 'Save As',
				icon : 'styles/cmp/images/icon-save-as.png'
			}, {
				text : 'Run',
				icon : 'styles/cmp/images/icon-run.png'
			}];

	var act_grp_3 = [{
				text : 'New',
				icon : 'styles/cmp/images/icon-new.png'
			}, {
				text : 'Delete',
				icon : 'styles/cmp/images/icon-delete.png'
			}, {
				text : 'Save As',
				icon : 'styles/cmp/images/icon-save-as.png'
			}, {
				text : 'Get NTI',
				icon : 'styles/cmp/images/icon-nti.png'
			}];

	var config = [{
		text : 'Strategy',
		icon : 'styles/cmp/images/new/icon-category-settings.png',
		children : [{
					text : 'Parameters',
					icon : 'styles/cmp/images/new/icon-parameters.png',
					children : [{
								nameTag : 'TECHNOLOGY',
								text : 'Technology',
								icon : 'styles/cmp/images/new/icon-technology.png',
								actions : act_grp_1,
								data : null
							}, {
								nameTag : 'PLANNING_CYCLE_ID',
								text : 'Planning Cycle',
								icon : 'styles/cmp/images/new/icon-planning.png',
								actions : act_grp_1,
								data : null
							}, {
								nameTag : 'SPECTRUMREGION_ID',
								text : 'Spectrum Region',
								icon : 'styles/cmp/images/new/icon-spectrum-region.png',
								actions : act_grp_1,
								data : null
							},{
								nameTag : 'ROLE_DEFINITION_ID',
								text : 'Role Definition',
								icon : 'styles/cmp/images/icon-location.png',
								actions : act_grp_1,
								data : null
							}
					// , {
					// nameTag:'POLYGON_ID',
					// text: 'Polygon',
					// icon: 'styles/cmp/images/icon-planned-sites.png',
					// actions: act_grp_1,
					// data: null
					// }, {
					// nameTag:'STATE_ID',
					// text: 'State',
					// icon: 'styles/cmp/images/icon-layers.png',
					// actions: act_grp_1,
					// data: null
					// }
					]
				}, {
					text : 'Sites',
					icon : 'styles/cmp/images/new/icon-sites.png',
					children : [{
								nameTag : 'SNAPSHOT_VERSION_ID',
								text : 'Snapshot',
								icon : 'styles/cmp/images/new/icon-snapshot.png',
								actions : act_grp_1,
								data : null
							}, {
								nameTag : 'SITEGROUP_ID',
								text : 'Site Group',
								icon : 'styles/cmp/images/new/icon-category.png',
								actions : act_grp_1,
								data : null
							}, {
								nameTag : 'PLANNED_SITE_ID',
								text : 'Planned Site',
								icon : 'styles/cmp/images/new/icon-planned-site.png',
								actions : act_grp_1,
								data : null
							}, {
								nameTag : 'PLANNED_SITEGROUP_ID',
								text : 'Planned Site Group',
								icon : 'styles/cmp/images/new/icon-planned-site-group.png',
								actions : act_grp_1,
								data : null
							}]
				}, {
					nameTag : 'STRATEGY_ID',
					text : 'Scenario',
					icon : 'styles/cmp/images/new/icon-scenario.png',
					children : []
				}]
	}, {
		text : 'Planning',
		icon : 'styles/cmp/images/new/icon-planning.png',
		children : [{
			text : 'Governance',
			icon : 'styles/cmp/images/new/icon-governance.png',
			children : [{
						text : 'Financial',
						icon : 'styles/cmp/images/new/icon-financial.png',
						children : [{
									nameTag : 'FINANCIAL_CATEGORY_TYPE',
									text : 'Category Settings',
									icon : 'styles/cmp/images/new/icon-group-settings.png',
									actions : act_grp_1,
									data : null
								}, {
									nameTag : 'FINANCIAL_CATEGORY',
									text : 'Category Items',
									icon : 'styles/cmp/images/new/icon-category2.png',
									actions : act_grp_1,
									data : null
								}
						// , {
						// nameTag: 'FINANCIAL_COST_DISTRIBUTION',
						// text: 'Cost Distribution',
						// icon: 'styles/cmp/images/icon-resource.png',
						// actions: act_grp_1,
						// data: null
						// }
						]
					}, {
						text : 'Service',
						icon : 'styles/cmp/images/new/icon-service.png',
						children : [{
									nameTag : 'WORKFLOW_CATEGORY_TYPE',
									text : 'Category Settings',
									icon : 'styles/cmp/images/new/icon-group-settings.png',
									actions : act_grp_1,
									data : null
								}, {
									nameTag : 'WORKFLOW_CATEGORY',
									text : 'Category Items',
									icon : 'styles/cmp/images/new/icon-planning2.png',
									actions : act_grp_1,
									data : null
								}, {
									nameTag : 'WORKFLOW_TEMPLATE',
									text : 'Workflow Templates',
									icon : 'styles/cmp/images/new/icon-workflow-templates.png',
									actions : act_grp_1,
									data : null
								}]
					}, {
						text : 'Resource',
						icon : 'styles/cmp/images/new/icon-resource.png',
						children : [{
									nameTag : 'RESOURCE_GROUP_ID',
									text : 'Group Settings',
									icon : 'styles/cmp/images/new/icon-group-settings.png',
									actions : act_grp_1,
									data : null
								}, {
									nameTag : 'RESOURCE_ID',
									text : 'Group Memebers',
									icon : 'styles/cmp/images/new/icon-group-memebers.png',
									actions : act_grp_1,
									data : null
								}, {
									nameTag : 'MSA_ID',
									text : 'Service Agreements',
									icon : 'styles/cmp/images/new/icon-category-setting.png',
									actions : act_grp_1,
									data : null
								}]
					}, {
						text : 'Equipment',
						icon : 'styles/cmp/images/new/icon-equipment.png',
						children : [{
							nameTag : 'EQUIPMENT_TYPE',
							text : 'Equipment Type',
							icon : 'styles/cmp/images/new/icon-equipment-type.png',
							actions : act_grp_1,
							data : null
						}, {
							nameTag : 'EQUIPMENT_RELATION',
							text : 'Equipment Template',
							icon : 'styles/cmp/images/new/icon-equipment.png',
							actions : act_grp_1,
							data : null
						}]
					}]
		}, {
			text : 'Change Management',
			icon : 'styles/cmp/images/new/icon-group-memebers.png',
			children : [{
						nameTag : 'CHANGE_REQUEST',
						text : 'Change Request',
						icon : 'styles/cmp/images/new/icon-change-request.png',
						actions : act_grp_1,
						data : null
					}, {
						text : 'Change Approval',
						icon : 'styles/cmp/images/new/icon-category-setting.png',
						actions : act_grp_1,
						data : null
					}, {
						text : 'Administration',
						icon : 'styles/cmp/images/new/icon-administration.png',
						actions : act_grp_1,
						data : null
					}]
		}]
	}, {
		text : 'Delivery',
		icon : 'styles/cmp/images/new/icon-delivery.png',
		children : [ {
			text : 'Dashboard',
			icon : 'styles/cmp/images/new/icon-category-setting.png',
			actions : act_grp_1,
			data : null
		}, {
			text : 'Implementation',
			icon : 'styles/cmp/images/new/icon-administration.png',
			actions : act_grp_1,
			data : null
		}		
		]
	}, {
		text : 'Notification Management',
		icon : 'styles/cmp/images/new/icon-group-settings.png',
		nameTag : 'NOTIFICATION_MANAGER'
	}];

	DigiCompass.Web.UI.Wheel.load(menuStr);
})();