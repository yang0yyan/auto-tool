// -------------------------------添加快捷键--------------------------------------- start
let companyCounnt = 0;
document.addEventListener('keydown', function(event) {
	if(event.altKey && event.key === '`'){
		chooseCompany(); // alt + `
	}else if (event.altKey && event.key === '1') {
		autoProcess1(); // alt + 1
    }else if(event.altKey && event.key === '2'){
		autoProcess2(companyCounnt*2); // alt + 2
	}
});
// --------------------------------添加快捷键-------------------------------------- end
// --------------------------------功能函数入口-------------------------------------- start
// 选择店铺
function chooseCompany(){
	companyCounnt = 0
	const checkboxList = document.getElementsByClassName("ant-modal-body")[0].getElementsByClassName("ant-checkbox-wrapper")
	// 黑名单
	const blacklist = ["1688-义乌市北贺电子商务商行","1688-义乌市乙进电子商务商行","1688-义乌市科曼康商贸有限公司"]
	for(let i = 1; i<checkboxList.length; i++){
		const item = checkboxList[i]
		const label = item.getElementsByClassName("antd-pro-components-goods-shelf-widgets-platform-and-store-modal-components-store-index-name")[0].innerText
		const tag = item.getElementsByClassName("antd-pro-components-goods-shelf-widgets-platform-and-store-modal-components-store-index-shelved")[0]
		// 已铺货的不选
		if(tag&&tag.innerText.trim()==='已铺货') continue;
		// 黑名单的不选
		if(blacklist.includes(label)) continue;
		simulateClick(item)
		companyCounnt++;
	}
}
// 功能二
async function autoProcess1() {
	let newOptions = getContainers1();
	choose1(newOptions[0], '其它')
	await new Promise(r => setTimeout(r, 1000));
	newOptions = getContainers1();
	choose1(newOptions[1], '含氯纤维（氯纶）')
	await new Promise(r => setTimeout(r, 1000));
	newOptions = getContainers1();
	choose1(newOptions[2], '30%以下')
	await new Promise(r => setTimeout(r, 500));
	choose1(newOptions[3], '中性/男女均可')
	await new Promise(r => setTimeout(r, 500));
	choose1(newOptions[4], '袋装')
	await new Promise(r => setTimeout(r, 500));
	inputPP(newOptions[5], "花式宠爱")
}
// 功能三
async function autoProcess2(limit){
	// 点击单选
	const radio1 = searchRadio("按产品规格报价");
	simulateClick(radio1);
	// 点击按钮
	await new Promise(r => setTimeout(r, 1000));
	const button = searchButton("批量智能设置单价");
	button.scrollIntoView({ block: 'center' });
	simulateClick(button);
	// 点击单选
	await new Promise(r => setTimeout(r, 1000));
	const radio2 = searchRadio("保留二位小数");
	simulateClick(radio2);
	// 输入数字
	await new Promise(r => setTimeout(r, 500));
	let dialog = getDialogContainer()
	let input1 = searchInput('pricePercent', 'ant-input-number-input', dialog)
	writeInput(input1, "106")
	// 点击确定
	await new Promise(r => setTimeout(r, 500));
	const button2 = searchButton("确 定", dialog);
	simulateClick(button2);
	
	// 点击单选
	await new Promise(r => setTimeout(r, 1000));
	const radio3 = searchRadio("支付时扣减");
	radio3.scrollIntoView({ block: 'center' });
	await new Promise(r => setTimeout(r, 500));
	simulateClick(radio3);
	// 输入数字
	await new Promise(r => setTimeout(r, 500));
	let input2 = searchInput('1688_minOrderQuantity', 'ant-input-number-input')
	writeInput(input2, "1")
	// 点击多选
	await new Promise(r => setTimeout(r, 500));
	const checkBox = searchCheckBox("支持混批");
	if(checkBox.className.indexOf("ant-checkbox-wrapper-checked")===-1)
		simulateClick(checkBox);
	// 选择选项
	await new Promise(r => setTimeout(r, 500));
	const select = searchSelect("请选择发货时间")
	simulateClick(select);
	await optionsClick('', '48小时发货', 0);
	await new Promise(r => setTimeout(r, 1000));
	
	const items = document.getElementsByClassName('antd-pro-components-goods-quick-shelf-components-multiple-shop-select-layouts-shop-item-layout-index-tempBox');
	const maxCount = Math.min(items.length, limit);
	for (let i = 0; i < maxCount; i++) {
		await processItem(items[i], i);
		await new Promise(r => setTimeout(r, 200));
	}
	// 点击按钮
	const btn = findBatchButton("重量(g)", "批量设置")
	btn.scrollIntoView({ block: 'center' });
	simulateClick(btn);
	await new Promise(r => setTimeout(r, 1000));
	// 输入数字
	let dialog2 = getDialogContainer()
	let input3 = searchInput('fixedVaule', 'ant-input-number-input', dialog2)
	writeInput(input3, "33")
	// 点击确定
	await new Promise(r => setTimeout(r, 200));
	const button3 = searchButton("确定并关闭", dialog2);
	simulateClick(button3);
	console.log('全部处理完成');
}
// ---------------------------------主函数入口------------------------------------- end
async function processItem(container, idx) {
  container.scrollIntoView({ block: 'center' });
  const selectDiv = Array.from(container.querySelectorAll('.ant-select')).find(el =>{
	let innerText= el.querySelector('.ant-select-selection-placeholder')?.innerText || ''
	return innerText.includes('发货地址')||innerText.includes('运费模板')
  });
  if (!selectDiv) {
    console.log(`[${idx}] 未找到发货地址选择器`);
    return;
  }
  const trigger = selectDiv.querySelector('.ant-select-selector');
  if (!trigger) return;
  simulateClick(trigger);
  await optionsClick('没用', '', idx);
}

// 根据文本查询按钮
function searchButton(txt, container = document){
	const buttons = container.getElementsByTagName("button")
	for(let i =0; i<buttons.length; i++){
		const button= buttons[i]
		if(txt === button.textContent){
			return button;
		}
	}
	return null
}
// 根据文本查询单选
function searchRadio(txt, container = document){
	let radioList = container.getElementsByClassName("ant-radio-wrapper")
	for(let i =0; i<radioList.length; i++){
		const radio= radioList[i]
		if(txt === radio.textContent){
			return radio;
		}
	}
	return null
}
// 根据文本查询多选
function searchCheckBox(txt, container = document){
	let checkBoxList = container.getElementsByClassName("ant-checkbox-wrapper")
	for(let i =0; i<checkBoxList.length; i++){
		const checkbox= checkBoxList[i]
		if(txt === checkbox.textContent){
			return checkbox;
		}
	}
	return null
}
// 查询输入框
function searchInput(id, className, container = document){
	const inputs = container.getElementsByTagName("input")
	for(let i =0; i<inputs.length; i++){
		const radio= inputs[i]
		let isMatch = true
		if(id && radio.id !== id) isMatch = false
		if(className && radio.className !== className) isMatch = false

		if(isMatch){
			return radio;
		}
	}
	return null
}
// 查询选择器
function searchSelect(txt, container = document){
	const selectDiv = Array.from(container.querySelectorAll('.ant-select')).find(el =>{
		let innerText= el.querySelector('.ant-select-selection-placeholder')?.innerText || ''
		return innerText.includes(txt)
	});
	if (!selectDiv) return null;
	const trigger = selectDiv.querySelector('.ant-select-selector');
	return trigger;
}
// 向输入框写入文字
function writeInput(input, text){
	if(!input){
		console.error("input 不能为空");
		return false;
	}
	simulateClick(input);
	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, text);
	// 6. 触发 input 事件，通知 Ant Design 组件数据已更新
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
}
// 获取弹窗容器
function getDialogContainer(){
	let container = document.getElementsByClassName("ant-modal-content")
	if(container&&container.length===1){
		return container[0];
	}
	return null;
}
// 模拟点击
function simulateClick(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const events = ['mousemove', 'mousedown', 'mouseup', 'click'];
  for (let type of events) {
    const event = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0,
      buttons: 1,
    });
    element.dispatchEvent(event);
  }
  return true;
}
// 点击选择器中的选项
async function optionsClick(avoidText = '没用', chooseText = '', logIndex = 0) {
  try {
    const dropdown = await waitForElement('.ant-select-dropdown:not(.ant-select-dropdown-hidden)', 200);
    const opts = dropdown.querySelectorAll('.ant-select-item-option');
    if (!opts.length) return false;

    let target = null;

    if (!chooseText) {
      const firstText = opts[0].querySelector('.ant-select-item-option-content')?.innerText.trim() || '';
      if (firstText !== avoidText) {
        target = opts[0];
      } else if (opts.length >= 2) {
        target = opts[1];
      }
    } else {
      for (let i = 0; i < opts.length; i++) {
        const txt = opts[i].querySelector('.ant-select-item-option-content')?.innerText.trim() || '';
        if (txt === chooseText) {
          target = opts[i];
          break;
        }
      }
    }
    if (target) {
      simulateClick(target);
      await new Promise(r => setTimeout(r, 200));
      return true;
    }
    return false;
  } catch (err) {
    console.error(`[${logIndex}] optionsClick 错误:`, err.message);
    return false;
  }
}
function waitForElement(selector, timeout = 200) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const el = document.querySelector(selector);
      if (el && el.offsetParent !== null && !el.classList.contains('ant-select-dropdown-hidden')) {
        resolve(el);
      } else if (Date.now() - start > timeout) {
        reject(new Error('等待超时'));
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}
// 查找表头中的指定按钮
function findBatchButton(headTxt, btnTxt, container = document){
	let tableHeaders = container.getElementsByClassName("art-table-header-cell")
	let mHead = null;
	for(let i = 0; i<tableHeaders.length; i++){
		const header = tableHeaders[i];
		if(header.innerText.indexOf(headTxt)>-1&&header.innerText.indexOf(btnTxt)>-1){
			mHead = header;
		}
	}
	if(!mHead) return null;
	const a = mHead.getElementsByTagName("a")
	if(a&&a.length>0) return a[0]
	return null;
}
function choose1(container, option){
	const trigger = container.querySelector('.ant-select-selector');
	if (!trigger) return;
	simulateClick(trigger);
	optionsClick('', option)
}
function inputPP(container, textToInput) {
	const inputs = container.getElementsByTagName("input")
	if (!inputs||inputs.length===0) {
		console.error(`未找到 id 为 "${inputId}" 的输入框`);
		return false;
	}
	const trigger = container.querySelector('.ant-select-selector');
	if (!trigger) return;
	simulateClick(trigger);
	const inputElement = inputs[0]
	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(inputElement, textToInput);
	// 6. 触发 input 事件，通知 Ant Design 组件数据已更新
    const inputEvent = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(inputEvent);
	inputElement.blur();
}

function getContainers1(){
	let model1 = document.getElementsByClassName("antd-pro-components-goods-quick-shelf-ali1688-shelf-components-category-property-index-bd")
	let options = model1[0].getElementsByClassName("ant-row ant-form-item antd-pro-components-goods-quick-shelf-ali1688-shelf-components-category-property-index-item")
	let newOptions = [];
	for(let i = 1; i <= options.length; i++){
		if(!(i%3))newOptions.push(options[i-1])
	}
	return newOptions;
}
async function processItem(container, idx) {
  container.scrollIntoView({ block: 'center' });
  const selectDiv = Array.from(container.querySelectorAll('.ant-select')).find(el =>{
	let innerText= el.querySelector('.ant-select-selection-placeholder')?.innerText || ''
	return innerText.includes('发货地址')||innerText.includes('运费模板')
  });
  if (!selectDiv) {
    console.log(`[${idx}] 未找到发货地址选择器`);
    return;
  }
  const trigger = selectDiv.querySelector('.ant-select-selector');
  if (!trigger) return;
  simulateClick(trigger);
  await optionsClick('没用', '', idx);
}