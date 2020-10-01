var CocreateAPiSocket = function() {
	this.init();
};

CocreateAPiSocket.prototype.init = function () {
	let _this = this;
	this.actionsBtn();
	CoCreateSocket.listen(this.req_socket,data=>{
		console.log("REsponseSocket ",data);
		_this.setResult(data);
	})
}

CocreateAPiSocket.prototype.setResult = function(data) {
}

CocreateAPiSocket.prototype.actionsBtn = function(){
		let that = this;
		document.addEventListener("click",function(e){
			let btn = e.target;
			let classList = btn.classList;
			classList = [...classList]
			if(classList.length){
				
				let classBtns = that.classBtns;
				let intercept = classBtns.filter(x => classList.includes(x.substr(1)));
				if(!intercept.length)
					return;
				btn.refClass = that;
				btn.selector = intercept[0];
				e.preventDefault();
				that.click_btn_fn(btn);
			}
		});
	}
	
CocreateAPiSocket.prototype.createAdtional = function(value){    
		let obj = {};
		obj['getAttribute'] = function(){
			return 'class';
		}
		obj['value'] = value
		return obj;
	}
	
CocreateAPiSocket.prototype.preview_validate_btn = function(btn,event){
	return true;
}

CocreateAPiSocket.prototype.validateKeysJson = function(json,rules){
	let keys_json = Object.keys(json);
	keys_json.forEach(key=>{
		const index = rules.indexOf(key);
		if(index != -1)
		rules.splice(index, 1);
	});
	if( rules.length )
		throw "Requires the following "+ rules.toString();
	},

CocreateAPiSocket.prototype.manipulateDataToSend = function(btn,data){
	return data;
}

CocreateAPiSocket.prototype.click_btn = function(event){
		event.preventDefault();
		let btn = this;
		let that = event.currentTarget.refClass;
		let selector = event.currentTarget.selector
		if(!that.preview_validate_btn(btn,event))
			return false;
		let dataToSend = that.getDataJSON(btn,that);
		console.log('dataToSend',dataToSend)
		dataToSend['type'] = selector;
		dataToSend = that.manipulateDataToSend(btn,dataToSend);
		//that.socket(selector,dataToSend)
		that.socket(dataToSend,that)
	}
	
CocreateAPiSocket.prototype.click_btn_fn = function(btn){
		let that = btn.refClass;
		let selector = btn.selector
		if(!that.preview_validate_btn(btn,event))
			return false;
		let dataToSend = that.getDataJSON(btn,that);
		console.log('dataToSend',dataToSend)
		dataToSend['type'] = selector;
		dataToSend = that.manipulateDataToSend(btn,dataToSend);
		that.socket(dataToSend,that)
	}    

CocreateAPiSocket.prototype.getDataJSON = function(btn,that){
	let form = btn.closest("form");
	let inputs = [].slice.call(form.querySelectorAll('['+that.data_param+']'));
	let data = {}
	inputs.forEach(input => {
		if( input.getAttribute(that.data_param).indexOf('[]')!=-1 ){
			if( typeof data[input.getAttribute(that.data_param)] == 'undefined' )
				data[input.getAttribute(that.data_param)] = []
			switch (input.getAttribute('type').toLocaleLowerCase()) {
				case 'checkbox':
					if(input.checked)
						data[input.getAttribute(that.data_param)].push(input.value)    
				break;
				default:
					data[input.getAttribute(that.data_param)].push(input.value)
			}
		}
		//single
		else 
			data[input.getAttribute(that.data_param)] = input.value;
	});
	return data;
}

CocreateAPiSocket.prototype.socket = (data,that)=>{ 
	console.log(".... Sending Request Socket to endPint ["+that.req_socket+"].....");
	CoCreateSocket.send(that.req_socket,data);
}

/**
 * @param object : data object
 * @param attributeName : data attribute name of input <- object key
 * @param addInfo : additional selector of input
 * @param parentInfo : parent selector of input
 */
CocreateAPiSocket.prototype.objToAtt = function(object, attributeName, addInfo = "", parentInfo = "") {
	let inputs = document.querySelectorAll(`${parentInfo} [data-${attributeName}]${addInfo}, ${parentInfo} [name]${addInfo}`);
	for (let input of inputs) {
		let key;
		key = input.dataset[attributeName];
		if (!key) key = input.getAttribute("name");
		let type = input.getAttribute("type");
		if (type == "button" || type == "submit" || type == "reset") continue;
		if (type == "radio" && key in object) input.checked = object[key] == input.getAttribute("value") ? true : false;
		else if (type == "checkbox" && key in object) input.checked = (object[key] == input.getAttribute("value")) || (Array.isArray(object[key]) && object[key].includes(input.getAttribute("value"))) ? true : false; // checked value = on
		else if (key in object)
			if (input.tagName == "input" || input.tagName == "textarea")input.value = object[key];
			else input.innerHTML = object[key];
	}
}
