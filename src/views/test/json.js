export default {
	$data :[{
		"id": "1201",
		"value": "北京市",
		"child": [{
			"id": "001",
			"value": "东城区",//【2级联动:北京市 > 东城区】
		},
			{
				"id": "002",
				"value": "西城区",//【3级联动:北京市 > 西城区 > aaa街道】
				"child": [{
					"id": "a",
					"value": "aaa街道"
				}, {
					"id": "b",
					"value": "bbb街道"
				}, {
					"id": "c",
					"value": "ccc街道"
				}]
			}]
	},
		{
			"id": "1203",
			"value": "福建省",
			"child": [{
				"id": "001",
				"value": "福州市",//【4级联动:福建省 > 福州市 > 晋安区 > a 街道】
				"child": [{
					"id": "a1",
					"value": "晋安区",
					"child": [{
						"id": "aaa",
						"value": "a街道"
					}, {
						"id": "bbb",
						"value": "b街道"
					}, {
						"id": "ccc",
						"value": "c街道"
					}, {
						"id": "ddd",
						"value": "d街道"
					}, {
						"id": "eee",
						"value": "e街道"
					}, {
						"id": "fff",
						"value": "f街道"
					}, {
						"id": "ggg",
						"value": "g街道"
					}, {
						"id": "hhh",
						"value": "h街道"
					}, {
						"id": "iii",
						"value": "i街道"
					}, {
						"id": "jjj",
						"value": "j街道"
					}, {
						"id": "kkk",
						"value": "k街道"
					}]
				},
					{
						"id": "b1",
						"value": "鼓楼区",
						"child": [{
							"id": "a",
							"value": "a道"
						}, {
							"id": "b",
							"value": "b道"
						}, {
							"id": "c",
							"value": "c道"
						}, {
							"id": "d",
							"value": "d道"
						}, {
							"id": "e",
							"value": "e道"
						}, {
							"id": "f",
							"value": "f道"
						}, {
							"id": "g",
							"value": "g道"
						}, {
							"id": "h",
							"value": "h道"
						}, {
							"id": "i",
							"value": "i道"
						}, {
							"id": "j",
							"value": "j道"
						}, {
							"id": "k",
							"value": "k道"
						}]
					}]
			},
				{
					"id": "002",
					"value": "厦门市",
					"child": [{
						"id": "2a",
						"value": "集美区",//【5级联动:福建省 > 厦门市 > 集美区 > aaa街道 > a1街道】
						"child": [{
							"id": "a",
							"value": "aaa街道",
							"child": [{
								"id": "aaa-1",
								"value": "a1街道",
							}, {
								"id": "aaa-2",
								"value": "a2街道",
							}]
						}, {
							"id": "b",
							"value": "bbb街道"
						}, {
							"id": "c",
							"value": "ccc街道"
						}, {
							"id": "d",
							"value": "ddd街道"
						}, {
							"id": "e",
							"value": "eee街道"
						}, {
							"id": "f",
							"value": "fff街道"
						}, {
							"id": "g",
							"value": "ggg街道"
						}, {
							"id": "h",
							"value": "hhh街道"
						}, {
							"id": "i",
							"value": "iii街道"
						}, {
							"id": "j",
							"value": "jjj街道"
						}, {
							"id": "k",
							"value": "kkk街道"
						}, {
							"id": "l",
							"value": "lll街道"
						}, {
							"id": "m",
							"value": "mmm街道"
						}, {
							"id": "n",
							"value": "nnn街道"
						}, {
							"id": "o",
							"value": "ooo街道"
						}, {
							"id": "p",
							"value": "ppp街道"
						}, {
							"id": "q",
							"value": "qqq街道"
						}, {
							"id": "r",
							"value": "rrr街道"
						}, {
							"id": "s",
							"value": "sss街道"
						}, {
							"id": "t",
							"value": "ttt街道"
						}]
					},
						{
							"id": "2b",
							"value": "湖里区",
							"child": [{
								"id": "a",
								"value": "aaa街道"
							}, {
								"id": "b",
								"value": "bbb街道"
							}, {
								"id": "c",
								"value": "ccc街道"
							}, {
								"id": "d",
								"value": "ddd街道"
							}, {
								"id": "e",
								"value": "eee街道"
							}, {
								"id": "f",
								"value": "fff街道"
							}, {
								"id": "g",
								"value": "ggg街道"
							}, {
								"id": "h",
								"value": "hhh街道"
							}, {
								"id": "i",
								"value": "iii街道"
							}, {
								"id": "j",
								"value": "jjj街道"
							}, {
								"id": "k",
								"value": "kkk街道"
							}, {
								"id": "l",
								"value": "lll街道"
							}, {
								"id": "m",
								"value": "mmm街道"
							}]
						},
						{
							"id": "2c",
							"value": "思明区",
						},
						{
							"id": "2d",
							"value": "同安区",
							"child": [{
								"id": "a",
								"value": "aaa街道"
							}, {
								"id": "b",
								"value": "bbb街道"
							}, {
								"id": "c",
								"value": "ccc街道"
							}]
						}]
				}]
		}
	],
	list3: [{
        name: '中国',
        value: 'china',
        parent: 0
      }, {
        name: '美国',
        value: 'USA',
        parent: 0
      }, {
        name: '广东',
        value: 'china001',
        parent: 'china'
      }, {
        name: '广西',
        value: 'china002',
        parent: 'china'
      }, {
        name: '美国001',
        value: 'usa001',
        parent: 'USA'
      }, {
        name: '美国002',
        value: 'usa002',
        parent: 'USA'
      }, {
        name: '广州',
        value: 'gz',
        parent: 'china001'
      },{
        name: '广州01',
        value: 'gz01',
        parent: 'gz'
      },{
        name: '深圳',
        value: 'sz',
        parent: 'china001'
      },{
        name: '深圳01',
        value: 'sz01',
        parent: 'sz'
      }, {
        name: '广西001',
        value: 'gx001',
        parent: 'china002'
      }, {
        name: '广西002',
        value: 'gx002',
        parent: 'china002'
      }, {
        name: '美国001_001',
        value: '0003',
        parent: 'usa001'
      },{
        name: '美国001_001_001',
        value: '001_001_001',
        parent: '0003'
      }, {
        name: '美国001_002',
        value: '0004',
        parent: 'usa001'
      }, {
        name: '美国002_001',
        value: '0005',
        parent: 'usa002'
      }, {
        name: '美国002_002',
        value: '0006',
        parent: 'usa002'
      }],
      list4: [{
        name: '中国',
        value: 'china',
        parent: 0
      }, {
        name: '美国',
        value: 'USA',
        parent: 0
      }, {
        name: '广东',
        value: 'china001',
        parent: 'china'
      }, {
        name: '广西',
        value: 'china002',
        parent: 'china'
      }, {
        name: '美国001',
        value: 'usa001',
        parent: 'USA'
      }, {
        name: '美国002',
        value: 'usa002',
        parent: 'USA'
      }, {
        name: '广州',
        value: 'gz',
        parent: 'china001'
      },{
        name: '广州01',
        value: 'gz01',
        parent: 'gz'
      },{
        name: '深圳',
        value: 'sz',
        parent: 'china001'
      },{
        name: '深圳01',
        value: 'sz01',
        parent: 'sz'
      }, {
        name: '广西001',
        value: 'gx001',
        parent: 'china002'
      },{
        name: '广西001_1',
        value: 'gx0011',
        parent: 'gx001'
      }, {
        name: '广西002',
        value: 'gx002',
        parent: 'china002'
      }, {
        name: '广西002_2',
        value: 'gx002_2',
        parent: 'gx002'
      }, {
        name: '美国001_001',
        value: '0003',
        parent: 'usa001'
      },{
        name: '美国001_001_001',
        value: '001_001_001',
        parent: '0003'
      }, {
        name: '美国001_002',
        value: '0004',
        parent: 'usa001'
      }, {
        name: '美国002_001',
        value: '0005',
        parent: 'usa002'
      }, {
        name: '美国002_002',
        value: '0006',
        parent: 'usa002'
			}],
		UplinkData:[
				{id:'1',value:'兰博基尼'},
				{
						id:'2',
						value:'劳斯莱斯',
						childs:[
								{
										id:'1',
										value:'曜影'
								},
								{
										id:'2',
										value:'幻影',
										childs:[
												{
														id:'1',
														value:'标准版'
												},
												{
														id:'2',
														value:'加长版'
												},
												{
														id:'3',
														value:'巅峰之旅'
												},
												{
														id:'4',
														value:'流光熠世'
												},
												{
														id:'5',
														value:'都会典藏版',
														childs:[
															{
																id:'5',
																value:'plus',
															},{
																id:'5',
																value:'small',
															}
														]
												}
										]
								},
								{
										id:'3',
										value:'古思特',
										childs:[
												{
														id:'1',
														value:'加长版'
												},
												{
														id:'2',
														value:'永恒之爱'
												},
												{
														id:'3',
														value:'英骥'
												},
												{
														id:'4',
														value:'阿尔卑斯典藏版'
												}
										]
								},
								{
										id:'4',
										value:'魅影',
										childs:[
												{
														id:'1',
														value:'标准版'
												},
												{
														id:'2',
														value:'Black Badge'
												}
										]
								}
						]
				},
				{
						id:'3',
						value:'宾利',
						childs:[
								{
										id:'1',
										value:'慕尚',
										childs:[
												{
														id:'1',
														value:'标准版'
												},
												{
														id:'2',
														value:'极致版'
												}
										]
								},
								{
										id:'2',
										value:'欧陆',
										childs:[
												{
														id:'1',
														value:'尊贵版'
												},
												{
														id:'2',
														value:'敞篷标准版'
												},
												{
														id:'3',
														value:'敞篷尊贵版'
												}
										]
								}
						]
				},
				{
						id:'4',
						value:'法拉利',
						childs:[
								{
										id:'1',
										value:'LaFerrari'
								},
								{
										id:'2',
										value:'法拉利488'
								},
								{
										id:'3',
										value:'GTC4Lusso'
								}
						]
				},
				{
						id:'5',
						value:'玛莎拉蒂',
						childs:[
								{
										id:'1',
										value:'总裁'
								},
								{
										id:'2',
										value:'玛莎拉蒂GT'
								},
								{
										id:'3',
										value:'Levante'
								}
						]
				}
		]
}
