jquery.cram.js
======================
## PLUGIN

### REQUIRE:
jquery.js  
jquery.easing.js // on use ease


### PARAMETERS:
    itemSelector : "*",
    cellWidth : 100,
    cellHeight : 1,
    marginWidth : 20,
    marginHeight : 20,
    isWindowResizeUpdate : true,
    isAutoLayout : true,
    isDrawSpace : false,
    animation : {
    	delayEach : 0,
    	duration : 0,
    	ease : null 
    }


### USAGE:
    $("#wrapper").cram({
    	itemSelector : ".item",
    	cellWidth : 100,
    	cellHeight : 100,
    	marginWidth : 20,
    	marginHeight : 20,
    	animation : {
    		duration : 100,
    		ease : "ExpoOut"
    	}
    });


---


## METHOD:

### setOptions
change options


#### PARAMETERS:
    itemSelector : "*",
    cellWidth : 100,
    cellHeight : 1,
    marginWidth : 20,
    marginHeight : 20,
    isWindowResizeUpdate : true,
    isAutoLayout : true,
    isDrawSpace : false,
    animation : {
    	delayEach : 0,
    	duration : 0,
    	ease : null
    }


#### USAGE:
    $("#wrapper").cram.setOptions({
    	cellWidth : 100,
    	cellHeight : 100,
    })


### update
calculate masonry layout  
update area width, area height, items position, spaces  
trigger "onUpdate" on calculated.


#### PARAMETERS: null


#### USAGE:
    $("#wrapper").cram.update();


---


## PROPERTY:

### data("items")
return items array


#### RETURN:
    [
    	{
    		element : DOM,
    		x : Number,
    		y : Number,
    		width : Number,
    		height : Number
    	},
    	...
    ]


#### USAGE:
    var items = $("#wrapper").data("items");



### data("spaces")
return spaces array


#### RETURN:
    [
      {
    		x : Number,
    		y : Number,
    		width : Number,
    		height : Number
    	},
    	...
    ]


#### USAGE:
    var spaces = $("#wrapper").data("spaces");



### data("area")
return layout area width and height


#### RETURN:
    {
    	width : Number,
    	height : NUmber
    }


#### USAGE:
    var areasize = $("wrapper").data("area");
    var areaWidth = areasize.width;
    var areaHeight = areasize.height;


---


## EVENT:

### onUpdate
dispatch on updated.

#### USAGE:
    $("#wrapper").bind("onUpdate", function() {
    	var items = $(this).data("items");
    	var spaces = $(this).data("spaces");
    	var areasize = $(this).data("area");
    });


---


---


## CLASS
only calculation operation

### REQUIRE:
*jquery.js


### PARAMETERS:
    confing : {
    	itemSelector : "*",  
    	cellWidth : 100,  
    	cellHeight : 1,  
    	marginWidth : 20,  
    	marginHeight : 20,  
    	isWindowResizeUpdate : true,  
    	isAutoLayout : true,  
    	isDrawSpace : false,  
    },
    width, // Number  
    list[array], // inner items  
    callback // function  


####list array
    [  
    	DOM,  
    	...  
    ]  

or  

    [  
    	{  
    		element : DOM,  
    		x : Number, // position fixed  
    		y : Number, // position fixed  
    		width : Number,  
    		height : Number  
    	},  
    	...  
    ]


#### USAGE:
    var opt = null;
    var width = 800;
    var list = $(".item");
    var cramlist = new cram(opt, width, list, function(data){
    	console.log data.items;
    	console.log data.spaces;
    	console.log data.area;
    });


### RETURN:

##### data\["items"\]
items array  

    [  
    	{  
    		element : DOM,  
    		x : Number, // position fixed  
    		y : Number, // position fixed  
    		cols : Number,  
    		rows : Number  
    		width : Number,  
    		height : Number  
    	},  
    	...  
    ]


#### data\["spaces"\]
spaces array  

    [  
    	{  
    		x : Number,  
    		y : Number,  
    		width : Number,  
    		height : Number  
    	},  
    	...  
    ]


#### data\["area"\]
layout area width and height

    {  
    	width : Number,  
    	height : NUmber  
    }


---


## METHOD:

### setOptions
change options


#### PARAMETERS:
    itemSelector : "*",  
    cellWidth : 100,  
    cellHeight : 1,  
    marginWidth : 20,  
    marginHeight : 20,  
    isWindowResizeUpdate : true,  
    isAutoLayout : true,  
    isDrawSpace : false,  


#### USAGE:
    var cramlist = new cram();
    cramlist.setOptions({
    	cellWidth : 100
    })



### getData
make items list, spaces list and area size


#### PARAMETERS:
    width, // Number  
    list[array], // inner items  
    callback // function  

list array

    [  
    	DOM,  
    	...  
    ]  

 or  

    [  
    	{  
    		element : DOM,  
    		x : Number,  
    		y : Number,  
    		width : Number,  
    		height : Number  
    	},  
    	...  
    ]


#### USAGE:
    var width = 800;
    var list = $(".item");
    var cramlist = new cram();
    cramlist.getData(width, list, function(data){
    	console.log data.items;
    	console.log data.spaces;
    	console.log data.area;
    });


### RETURN:


##### data\["items"\]
items array  

    [  
    	{  
    		element : DOM,  
    		x : Number,  
    		y : Number,  
    		cols : Number,  
    		rows : Number  
    		width : Number,  
    		height : Number  
    	},  
    	...  
    ]


#### data\["spaces"\]
spaces array  

    [  
    	{  
    		x : Number,  
    		y : Number,  
    		width : Number,  
    		height : Number  
    	},  
    	...  
    ]


#### data\["area"\]
layout area width and height

    {  
    	width : Number,  
    	height : NUmber  
    }
