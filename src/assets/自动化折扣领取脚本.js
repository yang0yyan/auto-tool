// ==UserScript==
// @name         自动化折扣领取脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按 Alt+1 开始自动领取，Alt+2 停止。自动筛选折扣大于 8.5 的选项。
// @author       yang
// @match        https://mms.pinduoduo.com/tool/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 折扣阈值
    const discountThreshold = 8.5;
    let discountIndex = 0;
    // 启停标志
    let isStop = true;
    let blacklist = []
    // 添加快捷键
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === '1') {
            if(!isStop) return
            isStop = false;
            optionSync(); // alt + 1
        }else if(event.altKey && event.key === '2'){
            console.log("<<<<<<<<<<<<< 中止运行 <<<<<<<<<<<<<");
            isStop = true; // alt + 2
        }
    });
    // 执行异步任务
    async function optionSync() {
        console.log(">>>>>>>>>>>>> 开始运行 >>>>>>>>>>>>>");
        isStop = false;
        blacklist = []
        discountIndex = 0;
        // 遍历并点击按钮
        let index = 0;
        while(true){
            let buttons = getAllBtn();
            if(index>=buttons.length) break
            console.log("1", "0");
            if(isStop) return
            const btn = buttons[index];
            // 如果是黑名单中的就跳过
            if(blacklist.includes(btn.customizeId)) {
                index++;
                continue
            }
            discountIndex++;
            simulateClick(btn)
            console.log("1", "1");
            if(isStop) return
            await chackDialogShow()
            console.log("1", "2");
            if(isStop) return
            await optionDiscount(btn)
            console.log("1", "3");
            if(isStop) return
            await new Promise(r => setTimeout(r, 1000));
            console.log("1", "4");
            index = 0;
        }
        isStop = true;
        console.log("<<<<<<<<<<<<< 运行结束 <<<<<<<<<<<<<");
    }
    // 获取所有“获取”按钮
    function getAllBtn() {
        const trList = document.querySelectorAll(".TB_tr_5-154-0")
        const ids = document.querySelectorAll(".TableList_lightText__YhSG2")
        // 获取所有领取按钮
        let getterList = []
        for (let index = 1; index < trList.length; index++) {
            const tr = trList[index];
            const btnList = tr.querySelectorAll(".BTN_outerWrapper_5-154-0")
            for (let index2 = 0; index2 < btnList.length; index2++) {
                const element = btnList[index2];
                if (element.innerHTML.indexOf('领取')>-1) {
                    // 获取唯一键 id，并关联到 element 上
                    const idElement = ids[index-1];
                    element.customizeId = getID(idElement.innerText)
                    getterList.push(element)
                }
            }
        }
        return getterList;
    }
    // 处理折扣的函数
    async function optionDiscount(element){
        const body = getDialogBody();
        const isTure = chackDiscount(body);
        if(isTure){
            console.log("折扣通过", discountIndex)
            await new Promise(r => setTimeout(r, 2000));
            if(isStop) return
            // closeDialog()
            // await chackDialogHide()
            const btn = searchButton("确认提交", body)
            simulateClick(btn)
            console.log("1");
            await chackDialogHide()
            console.log("2");
            await new Promise(r => setTimeout(r, 1000));
            console.log("3");
            closeDialog()
            console.log("4");
            await chackDialogHide()
            console.log("5");
        }else{
            console.log("折扣不通过", discountIndex)
            blacklist.push(element.customizeId)
            await new Promise(r => setTimeout(r, 2000));
            closeDialog()
            await chackDialogHide()
        }
    }
    // 检查折扣的函数，如果成立返回 true，反之 false.
    function chackDiscount(container = document) {
        const discountList = container.querySelectorAll(".SuggestActivityPrice_colorGray__2XrPn")
        let isTure = true
        if (!discountList || discountList.length === 0) return false
        for (let index = 0; index < discountList.length; index++) {
            const element = discountList[index];
            const discount = element.querySelector("span").textContent
            if (parseFloat(discount) < discountThreshold) {
                isTure = false;
            }
        }
        return isTure;
    }
    // 获取弹窗体
    function getDialogBody() {
        return document.querySelector(".MDL_body_5-154-0")
    }
    // -------------------------------窗口相关----------------------------- start
    // 等待窗口关闭
    async function chackDialogHide(){
        while(true){
            const body = getDialogBody();
            if(!body) break
            closeDialog()
            await new Promise(r => setTimeout(r, 200));
        }
    }
    // 等待窗口显示
    async function chackDialogShow(){
        while(true){
            const body = getDialogBody();
            if(body && document.querySelector(".SuggestActivityPrice_activePrice__HMOwC",body)) break
            await new Promise(r => setTimeout(r, 500));
        }
    }
    // 关闭窗口
    function closeDialog(){
        const cBtn = document.querySelector(".MDL_iconWrapper_5-154-0")
        if(cBtn)
            simulateClick(cBtn)
    }
    // -------------------------------窗口相关----------------------------- end
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
    // 根据文本查询按钮
    function searchButton(txt, container = document){
        const buttons = container.querySelectorAll("button")
        for(let i =0; i<buttons.length; i++){
            const button= buttons[i]
            if(txt === button.textContent){
                return button;
            }
        }
        return null
    }
    // 获取文本中的数字
    function getID(str){
        const matches = str.match(/\d+/g);
        return matches[0]
    }
})();
