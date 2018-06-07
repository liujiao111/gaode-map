/**
 * 地图覆盖物
 */

var kpPolygon = {
		mapType : 1, //高德地图
		
		amapLayerList: [], //高德地图覆盖物List
		bmapLayerList: [], //百度地图覆盖物List
		
		amapMarkerList: [], //高德地图点标记List
		bmapMarkerList: [], //百度地图点标记List
		
		amapCircleList: [], //高德地图圆形覆盖物List
		bmapCircleList: [], //百度地图圆形覆盖物List
		
		//高德地图覆盖物默认样式
		amapOverLayerOptions : {
			strokeColor: "#FF33FF", //线颜色
	        strokeOpacity: 0.2, //线透明度
	        strokeWeight: 3,    //线宽
	        fillColor: "#1791fc", //填充色
	        fillOpacity: 0.35,//填充透明度
		},
		
		//百度地图覆盖物默认样式
		bmapOverLayerOptions : {
			strokeColor:"blue",
			strokeWeight:2,
			strokeOpacity:0.5
		},

		//高德地图点标记默认样式
		amapMarkerOptions : {
			icon : 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
		},
		
		//百度地图点标记默认样式
		bmapMarkerOptions :{
			strokeColor:"blue",
			strokeWeight:2,
			strokeOpacity:0.5
		},
		
		//高德地图圆形覆盖物默认样式
		amapCircleOptions : {
			radius: 500,  //半径
		    strokeColor: "#F33",  //线颜色
		    strokeOpacity: 1,  //线透明度
		    strokeWeight: 3,  //线粗细度
		    fillColor: "#ee2200",  //填充颜色
		    fillOpacity: 0.35 //填充透明度
		},
		
		//百度地图圆形覆盖物默认样式
		bmapCircleOptions : {
			radius : 500,
			strokeColor:"blue",
			strokeWeight:2,
			strokeOpacity:0.5
		},

		/**
		 * 图层添加点标记
		 * @param {Object} map 地图对象
		 * @param {Object} markerData 格式：112.3433,23.4545; 112.3433,23.4545; 112.3433,23.4545
		 * @param {Object} options  点标记样式
		 * 
		 */
		addMarker: function(map, markerData, options) {
			var _this = this;
			var returnMarkerList = [];
			var markerArr = markerData.split(";");
			
			if(map['CLASS_NAME'] == 'AMap.Map') {
				for (var i = 0; i < markerArr.length; i ++) {
					var lng = parseFloat(markerArr[i].split(",")[0]);
					var lat = parseFloat(markerArr[i].split(",")[1]);
					var onePoint = [];
					onePoint.push(lng);
					onePoint.push(lat);
					$.extend(true, _this.amapMarkerOptions, options);
					_this.amapMarkerOptions['position'] = onePoint;
					var marker = new AMap.Marker(_this.amapMarkerOptions);
					var markerId = _this.uuid();
					marker['id'] = markerId;
					map.add(marker);
					_this.amapMarkerList.push(marker);
					returnMarkerList.push(marker);
				}
			} else {
				for (var i = 0; i < markerArr.length; i ++) {
					var lng = parseFloat(markerArr[i].split(",")[0]);
					var lat = parseFloat(markerArr[i].split(",")[1]);
					$.extend(true, _this.bmapMarkerOptions, options);
					var marker = new BMap.Marker(new BMap.Point(lng, lat), _this.bmapMarkerOptions);
					var markerId = _this.uuid();
					marker['id'] = markerId;
					map.addOverlay(marker);
					_this.bmapMarkerList.push(marker);
					returnMarkerList.push(marker);
					_this.mapType = 2;
				}
			}
			
			return returnMarkerList;
		},

		/**
		 * 向地图上添加多边形覆盖物
		 * @param {Object} map
		 * @param {Object} mapType
		 * @param {Object} layerData  格式：112.3433,23.4545; 112.3433,23.4545; 112.3433,23.4545
		 * @param {Object} options  覆盖物样式 (可选)
		 * @return {Object} polygon  覆盖物对象(有唯一ID标识)
		 */
		addLayer: function(map, layerData, options) {
			var _this = this;
			var coordArr = layerData.split(";");
			var polygon;
			
			if(map['CLASS_NAME'] == 'AMap.Map') {
				//高德地图	
				var polygonArr = new Array(); //多边形覆盖物节点坐标数组
				for(var i = 0; i < coordArr.length; i++) {
					var oneCoord = [];
					var lng = parseFloat(coordArr[i].split(",")[0]);
					var lat = parseFloat(coordArr[i].split(",")[1]);
					oneCoord.push(lng);
					oneCoord.push(lat);
					polygonArr.push(oneCoord);
				}
				$.extend(true, _this.amapOverLayerOptions, options);
				_this.amapOverLayerOptions['path'] = polygonArr;
				_this.amapOverLayerOptions['path'] = polygonArr;
				polygon = new AMap.Polygon(_this.amapOverLayerOptions);
				polygon.setMap(map);
				polygon['id'] = _this.uuid();
				_this.amapLayerList.push(polygon);
			} else {
				//百度地图
				var polygonArr = [];
				for(var i = 0; i < coordArr.length; i++) {
					var lng = parseFloat(coordArr[i].split(",")[0]);
					var lat = parseFloat(coordArr[i].split(",")[1]);
					var point = new BMap.Point(lng, lat);
					polygonArr.push(point);
				}
				$.extend(true, _this.bmapOverLayerOptions, options);
				var polygon = new BMap.Polygon(polygonArr, _this.bmapOverLayerOptions);
				map.addOverlay(polygon);
				polygon['id'] = _this.uuid();
				_this.bmapLayerList.push(polygon);
				_this.mapType = 2;
			}
			
			return polygon;
 		},
 		
 		/**
 		 * 向地图添加圆形覆盖物
 		 * @param {Object} map  地图对象
 		 * @param {Object} center  圆心经纬度 ： 格式：116.403322,39.920255
 		 * @param {Object} options 圆形覆盖物参数 ： 特别地,radius半径参数默认500，如果需要改变大小，需要传入该参数进行覆盖
 		 */
 		addCircle : function(map, center, options) {
 			var _this = this;
 			if(map['CLASS_NAME'] == 'AMap.Map') {
 				//高德地图
 				$.extend(true, _this.amapCircleOptions, options);
 				var lng = center.split(",")[0];
 				var lat = center.split(",")[1];
 				var center = new AMap.LngLat(lng, lat);
 				_this.amapCircleOptions['center'] = center;
 				var circle = new AMap.Circle(_this.amapCircleOptions);
 				var circleId = _this.uuid();
 				circle['id'] = circleId;
 				map.add(circle);
 				_this.amapCircleList.push(circle);
 				return circle;
 			} else {
 				//百度地图
 				$.extend(true, _this.bmapCircleOptions, options);
 				var lng = center.split(",")[0];
 				var lat = center.split(",")[1];
 				var point = new BMap.Point(lng, lat);
 				options = options ? options : {};
 				var radius = radius in options ? options['radius'] : _this.bmapCircleOptions['radius'];
 				var newOptions = {};
 				$.extend(true, newOptions, _this.bmapCircleOptions);
 				delete(newOptions['radius']);
 				var circle = new BMap.Circle(point, radius, newOptions);
 				var circleId = _this.uuid();
 				circle['id'] = circleId;
 				map.addOverlay(circle);
 				_this.bmapCircleList.push(circle);
 				_this.mapType = 2;
 				return circle;
 			}
 		},
		
		/**
		 * 根据ID获取覆盖物对象
		 * @param {Object} id 覆盖物ID
		 * @return {Object} polygon 覆盖物对象
		 */
		getOverLayerById : function(id) {
			var _this = this;
			if(_this.mapType == 1) {
				//高德地图
				return _this.getSameFromList(id, _this.amapLayerList);
			} 
			if(_this.mapType == 2) {
				//百度地图
				return _this.getSameFromList(id, _this.bmapLayerList);
			}
		},
		
		/**
		 * 根据ID获取点标记覆盖物
		 * @param {Object} id
		 * @return {Object} marker 覆盖物对象
		 */
		getMarkerById : function(id) {
			var _this = this;
			if(_this.mapType == 1) {
				//高德地图
				return _this.getSameFromList(id, _this.amapMarkerList);
			} 
			
			if(_this.mapType == 2) {
				//百度地图
				return _this.getSameFromList(id, _this.bmapMarkerList);
			}
		},
		
		/**
		 * 根据ID获取圆形覆盖物对象
		 * @param {Object} id
		 */
		getCircleById : function(id) {
			var _this = this;
			if(_this.mapType == 1) {
				//高德地图
				return _this.getSameFromList(id, _this.amapCircleList);
			} 
			
			if(_this.mapType == 2) {
				//百度地图
				return _this.getSameFromList(id, _this.bmapCircleList);
			}
		},
		
		/**
		 * 根据覆盖物ID移除覆盖物
		 * @param {Object} id
		 * 高德地图使用polygon.setMap(null); 百度地图：map.removeOverlay(polygon);
		 */
		removeOverLayerById : function(id) {
			var _this = this;
			if(_this.amapLayerList.length > 0) {
				var residualCoveringList = _this.removeCoveringById(id, _this.amapLayerList, 1);
				_this.amapLayerList = residualCoveringList;
			}
			if(_this.bmapLayerList.length > 0) {
				var residualCoveringList = _this.removeCoveringById(id, _this.bmapLayerList, 2);
				_this.bmapLayerList = residualCoveringList;
			}
			
		},
		
		/**
		 * 根据ID移除地图上的点标记覆盖物
		 * @param {Object} id
		 */
		removeMarkerById : function(id) {
			var _this = this;
			if(_this.amapMarkerList.length > 0) {
				var residualCoveringList = _this.removeCoveringById(id, _this.amapMarkerList, 1);
				_this.amapMarkerList = residualCoveringList;
			}
			if(_this.bmapMarkerList.length > 0) {
				var residualCoveringList = _this.removeCoveringById(id, _this.bmapMarkerList, 2);
				_this.bmapMarkerList = residualCoveringList;
			}
		},
		
		/**
		 * 根据ID移除圆形覆盖物
		 * @param {Object} id
		 */
		removeCircleById : function(id) {
			var _this = this;
			if(_this.amapCircleList.length > 0) {
				var residualCoveringList = _this.removeCoveringById(id, _this.amapCircleList, 1);
				_this.amapCircleList = residualCoveringList;
			}
			if(_this.bmapCircleList.length > 0) {
				var residualCoveringList = _this.removeCoveringById(id, _this.bmapCircleList, 2);
				_this.bmapCircleList = residualCoveringList;
			}
		},
		
		/**
		 * 根据ID移除覆盖物 - 通用方法
		 * @param {Object} id 需要移除的覆盖物ID
		 * @param {Object} orgCoveringList 图层集合
		 * @param {Object} type 地图类型1,高德地图，2百度地图
		 * @return {Object} residualCoveringList 移除单个覆盖物后剩余的图层元素集合
		 */
		removeCoveringById : function(id, orgCoveringList,  type) {
			var residualCoveringList = [];
			if(orgCoveringList.length > 0) {
				for (var i = 0; i < orgCoveringList.length; i ++) {
					var covering = orgCoveringList[i];
					var coveringId = covering['id'];
					if(id == coveringId) {
						if(type == 1){
							covering.setMap(null);  //移除覆盖物
						}
						if(type == 2) {
							var map = covering.getMap();
							map.removeOverlay(covering);
						}
						
					} else {
						residualCoveringList.push(covering);
					}
				}
			}
			return residualCoveringList;
		},
		
		/**
		 * 移除所有的覆盖物图层
		 * 高德地图使用polygon.setMap(null); 百度地图：map.removeOverlay(polygon);
		 */
		removeAllOverLayer : function() {
			var _this = this;
			if(_this.amapLayerList.length > 0){
				_this.removeCovering(_this.amapLayerList, 1);
			}
			if(_this.bmapLayerList.length > 0){
				_this.removeCovering(_this.bmapLayerList, 2);
			}
			_this.amapLayerList = [];
			_this.bmapLayerList = [];  //清空
		},
		
		/**
		 * 移除所有的圆形覆盖物图层
		 */
		removeAllCircle : function(){
			var _this = this;
			if(_this.amapCircleList.length > 0){
				_this.removeCovering(_this.amapCircleList, 1);
			}
			if(_this.bmapCircleList.length > 0){
				_this.removeCovering(_this.bmapCircleList, 2);
			}
			_this.amapCircleList = [];
			_this.bmapCircleList = [];  //清空
		},
		
		/**
		 * 移除地图上所有的点标记覆盖物
		 */
		removeAllMarker : function() {
			var _this = this;
			if(_this.amapMarkerList.length > 0){
				_this.removeCovering(_this.amapMarkerList, 1);
			}
			if(_this.bmapMarkerList.length > 0){
				_this.removeCovering(_this.bmapMarkerList, 2);
			}
			_this.amapMarkerList = [];
			_this.bmapMarkerList = [];  //清空
		},
		
		
		/**
		 * 移除图层
		 * @param {Object} circleList  图层集合
		 * @param {Object} type 地图类型 1 代表高德地图，2代表百度地图
		 */
		removeCovering : function(circleList, type) {
			var _this = this;
			if(circleList.length > 0) {
				for (var i = 0; i < circleList.length; i ++) {
					var circle = circleList[i];
					if(type == 1) { 
						circle.setMap(null);  //高德移除图层方法
					}
					if(type == 2) { 
						var map = circle.getMap();
						map.removeOverlay(circle); //百度移除图层方法
					}
				}
			}
		},
		
		/**
		 * 内部方法：
		 * 返回list中覆盖物的ID相同的覆盖物对象
		 * @param {Object} id
		 * @param {Object} orgList
		 */
		getSameFromList : function(id, orgList) {
			for (var i=0; i < orgList.length; i ++) {
				var covering = orgList[i];
				var coveringId = covering['id'];
				if(id == coveringId) {
					return covering;
				}
			}
		},
		
		/**
		 * 生成UUID
		 * @return {Object} 生成的UUID字符串序列
		 */
		uuid : function() {
		    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
		},
		
		/*getMapType : function (map) {
			if(map['CLASS_NAME'] == 'AMap.Map') { 
				return 
			} else {
				return 
			}
		}*/
			
}