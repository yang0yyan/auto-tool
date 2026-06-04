document.addEventListener('keydown', function(event) {
	if (event.altKey && event.key === '1') {
		start(); // alt + 1
    }
});
async function start(){
    chooseGoods();
    new Promise(r => setTimeout(r, 500));
    inputSize();
}
function chooseGoods() {
  const goods = document.querySelector(
    ".antd-pro-components-goods-quick-shelf-dy-shelf-components-size-chart-components-size-checkbox-list-index-content",
  );
  if (!goods) return;
  const children = goods.children;
  for (let index = 0; index < children.length; index++) {
    const element = children[index];
    let isCheck =
      element.className.indexOf("ant-checkbox-wrapper-checked") > -1;
    if (element.innerHTML.indexOf("身高") > -1) {
      if (!isCheck) simulateClick(element);
    } else if (element.innerHTML.indexOf("体重") > -1) {
      if (!isCheck) simulateClick(element);
    } else if (element.innerHTML.indexOf("脚长") > -1) {
      if (!isCheck) simulateClick(element);
    } else {
      if (isCheck) simulateClick(element);
    }
  }
}
function inputSize() {
  const table = document.querySelector(
    ".antd-pro-components-goods-quick-shelf-dy-shelf-components-size-chart-components-table-index-table",
  );
  if (!table) return;
  const children = table.querySelectorAll("input");
  let height = 180;
  let weight = 160;
  let length = 11;
  for (let index = 0; index < children.length; index++) {
    const input = children[index];
    const id = input.id;
    if (id.indexOf("身高") > -1) {
      writeInput(input, height);
      height++;
    } else if (id.indexOf("体重") > -1) {
      writeInput(input, weight);
      weight++;
    } else if (id.indexOf("脚长") > -1) {
      writeInput(input, length);
      length++;
    }
  }
}

function simulateClick(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const events = ["mousemove", "mousedown", "mouseup", "click"];
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

const table = document.querySelector(
  ".antd-pro-components-goods-quick-shelf-dy-shelf-components-size-chart-components-table-index-table",
);
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

/**
 * await new Promise(r => setTimeout(r, 500));
let aaa = document.querySelector(".antd-pro-ui-select-index-prefixWrapper")
const select = aaa.querySelector('.ant-select-selector');
simulateClick(select);
await optionsClick('', '', 0);
constselect = searchSelect("请选择售后服务")
	simulateClick(select);
	await optionsClick('', '', 0);
	await new Promise(r => setTimeout(r, 1000));
	
	
ant-select ant-select-single ant-select-allow-clear ant-select-show-arrow ant-select-show-search
 */
