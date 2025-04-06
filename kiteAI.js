// ==UserScript==
// @name         kiteAI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  kiteAI
// @author       YourName
// @match        https://testnet.gokite.ai/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(async function() {
    // 定义执行点击操作的函数
    async function executeClickOperation() {
        try {
            console.log('脚本开始执行，版本: 7.4');
        // 确保在浏览器环境中运行
        if (typeof document === 'undefined') {
            console.error('错误: 此脚本必须在浏览器环境中运行');
            return 0;
        }

        console.log('等待页面完全加载...');
        // 增加等待时间确保Web组件和Shadow DOM完全加载
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('等待完成，开始查找MetaMask按钮...');

        // 检查页面是否已经加载完成
        if (document.readyState !== 'complete') {
            console.log('页面尚未完全加载，等待加载完成...');
            await new Promise(resolve => {
                window.addEventListener('load', resolve, {once: true});
                // 设置超时，防止无限等待
                setTimeout(resolve, 3000);
            });
        }

        // 记录页面结构，帮助调试
        console.log('页面上的Web组件:');
        // 使用更精确的选择器查找Web组件
        try {
            // 查找所有自定义元素
            const allCustomElements = Array.from(document.querySelectorAll('*'))
                .filter(el => el.tagName.includes('-'));

            console.log(`找到 ${allCustomElements.length} 个自定义元素`);

            // 记录所有w3m-开头的元素
            const w3mElements = allCustomElements.filter(el =>
                el.tagName.toLowerCase().startsWith('w3m-'));
            w3mElements.forEach(el => {
                console.log(`- W3M元素: ${el.tagName}`);
            });

            // 记录所有wui-开头的元素
            const wuiElements = allCustomElements.filter(el =>
                el.tagName.toLowerCase().startsWith('wui-'));
            wuiElements.forEach(el => {
                console.log(`- WUI元素: ${el.tagName}`);
            });

            // 记录其他可能相关的Web3钱包元素
            const otherWalletElements = allCustomElements.filter(el =>
                el.tagName.toLowerCase().includes('wallet') ||
                el.tagName.toLowerCase().includes('web3') ||
                el.tagName.toLowerCase().includes('connect'));
            otherWalletElements.forEach(el => {
                if (!w3mElements.includes(el) && !wuiElements.includes(el)) {
                    console.log(`- 其他钱包相关元素: ${el.tagName}`);
                }
            });
        } catch (error) {
            console.error('查找Web组件时出错:', error);
        }

        // 方法1: 直接通过data-testid属性查找MetaMask按钮
        console.log('方法1: 通过data-testid属性查找MetaMask按钮');
        const directMetaMaskButton = document.querySelector('wui-list-wallet[data-testid="wallet-selector-io.metamask"]');
        if (directMetaMaskButton) {
            console.log('直接找到MetaMask按钮:', directMetaMaskButton);
            try {
                directMetaMaskButton.click();
                console.log('已点击MetaMask按钮');
                return 8888;
            } catch (clickError) {
                console.error('直接点击失败:', clickError);
                // 如果直接点击失败，尝试查找shadowRoot中的button
                if (directMetaMaskButton.shadowRoot) {
                    const innerButton = directMetaMaskButton.shadowRoot.querySelector('button');
                    if (innerButton) {
                        console.log('找到shadowRoot中的button，尝试点击');
                        innerButton.click();
                        console.log('已点击shadowRoot中的button');
                        return 8888;
                    }
                }
            }
        } else {
            console.log('未找到具有特定data-testid的MetaMask按钮');
        }

        // 方法2: 通过name属性查找MetaMask按钮
        console.log('方法2: 通过name属性查找MetaMask按钮');
        const nameMetaMaskButton = document.querySelector('wui-list-wallet[name="MetaMask"]');
        if (nameMetaMaskButton) {
            console.log('通过name属性找到MetaMask按钮:', nameMetaMaskButton);
            try {
                nameMetaMaskButton.click();
                console.log('已点击MetaMask按钮');
                return 8888;
            } catch (clickError) {
                console.error('点击失败:', clickError);
                if (nameMetaMaskButton.shadowRoot) {
                    const innerButton = nameMetaMaskButton.shadowRoot.querySelector('button');
                    if (innerButton) {
                        console.log('找到shadowRoot中的button，尝试点击');
                        innerButton.click();
                        console.log('已点击shadowRoot中的button');
                        return 8888;
                    }
                }
            }
        } else {
            console.log('未找到name="MetaMask"的按钮');
        }

        // 方法3: 查找所有wui-list-wallet元素并检查其内容
        console.log('方法3: 查找所有wui-list-wallet元素');
        const allWalletListItems = document.querySelectorAll('wui-list-wallet');
        console.log(`找到 ${allWalletListItems.length} 个wui-list-wallet元素`);

        for (const item of allWalletListItems) {
            console.log('检查wallet列表项:', item);
            const text = item.textContent || '';
            if (text.toLowerCase().includes('metamask')) {
                console.log('找到包含MetaMask文本的wallet列表项');
                try {
                    item.click();
                    console.log('已点击wallet列表项');
                    return 8888;
                } catch (clickError) {
                    console.error('点击失败:', clickError);
                    if (item.shadowRoot) {
                        const innerButton = item.shadowRoot.querySelector('button');
                        if (innerButton) {
                            console.log('找到shadowRoot中的button，尝试点击');
                            innerButton.click();
                            console.log('已点击shadowRoot中的button');
                            return 8888;
                        }
                    }
                }
            }
        }

        // 递归遍历Shadow DOM的函数 - 增强版
        function traverseShadowDOM(element, callback, depth = 0) {
            if (!element || depth > 15) return; // 增加最大深度，防止无限递归

            try {
                // 对当前元素执行回调
                callback(element, depth);

                // 检查是否有Shadow DOM
                if (element.shadowRoot) {
                    console.log(`在深度 ${depth} 找到shadowRoot: ${element.tagName}`);
                    // 遍历Shadow DOM中的所有元素
                    const shadowChildren = element.shadowRoot.querySelectorAll('*');
                    console.log(`shadowRoot中有 ${shadowChildren.length} 个元素`);

                    shadowChildren.forEach(child => {
                        traverseShadowDOM(child, callback, depth + 1);
                    });
                }

                // 遍历子元素
                if (element.children && element.children.length > 0) {
                    Array.from(element.children).forEach(child => {
                        traverseShadowDOM(child, callback, depth + 1);
                    });
                }

                // 检查是否有slot元素，这些可能包含投影内容
                const slots = element.querySelectorAll('slot');
                if (slots.length > 0) {
                    console.log(`在深度 ${depth} 找到 ${slots.length} 个slot元素`);
                    slots.forEach(slot => {
                        // 获取分配给slot的节点
                        const assignedNodes = slot.assignedNodes({flatten: true});
                        assignedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                traverseShadowDOM(node, callback, depth + 1);
                            }
                        });
                    });
                }
            } catch (error) {
                console.error(`遍历Shadow DOM时出错(深度 ${depth}):`, error);
            }
        }

        // 查找MetaMask按钮的主函数 - 增强版
        async function findMetaMaskButton() {
            console.log('开始查找MetaMask按钮...');
            let metamaskButtons = [];

            // 策略1: 查找特定的Web组件结构
            console.log('策略1: 查找特定的Web组件结构');
            // 查找所有可能的Web3钱包连接组件
            const possibleWidgets = [
                'w3m-connect-injected-widget',
                'w3m-injected-connector-option',
                'w3m-wallet-item',
                'w3m-button',
                'w3m-connect-button',
                'w3m-modal',
                'w3m-core-button',
                'wui-connect-button',
                'wui-card',
                'wui-list-wallet',
                'wui-list-item',
                'wui-button'
            ];

            for (const widgetSelector of possibleWidgets) {
                const widgets = document.querySelectorAll(widgetSelector);
                if (widgets.length > 0) {
                    console.log(`找到 ${widgets.length} 个 ${widgetSelector} 组件`);

                    for (const widget of widgets) {
                        // 检查文本内容
                        const text = widget.textContent || '';
                        if (text.toLowerCase().includes('metamask')) {
                            console.log(`找到包含MetaMask文本的 ${widgetSelector}:`, widget);
                            metamaskButtons.push(widget);
                        }

                        // 检查属性
                        if (widget.getAttribute) {
                            const name = widget.getAttribute('name');
                            const dataTestId = widget.getAttribute('data-testid');
                            const ariaLabel = widget.getAttribute('aria-label');

                            if (name && name.toLowerCase().includes('metamask')) {
                                console.log(`找到name包含MetaMask的 ${widgetSelector}:`, widget);
                                metamaskButtons.push(widget);
                            }

                            if (dataTestId && dataTestId.toLowerCase().includes('metamask')) {
                                console.log(`找到data-testid包含MetaMask的 ${widgetSelector}:`, widget);
                                metamaskButtons.push(widget);
                            }

                            if (ariaLabel && ariaLabel.toLowerCase().includes('metamask')) {
                                console.log(`找到aria-label包含MetaMask的 ${widgetSelector}:`, widget);
                                metamaskButtons.push(widget);
                            }
                        }

                        // 遍历Shadow DOM
                        if (widget.shadowRoot) {
                            console.log(`检查 ${widgetSelector} 的Shadow DOM`);
                            traverseShadowDOM(widget, (element, depth) => {
                                // 检查元素文本是否包含MetaMask
                                const text = element.textContent || '';
                                if (text.toLowerCase().includes('metamask')) {
                                    console.log(`在 ${widgetSelector} 的Shadow DOM深度 ${depth} 找到包含MetaMask文本的元素:`, element);
                                    metamaskButtons.push(element);
                                }

                                // 检查元素属性
                                if (element.getAttribute) {
                                    const name = element.getAttribute('name');
                                    const dataTestId = element.getAttribute('data-testid');
                                    const ariaLabel = element.getAttribute('aria-label');

                                    if (name && name.toLowerCase().includes('metamask')) {
                                        console.log(`在Shadow DOM深度 ${depth} 找到name包含MetaMask的元素:`, element);
                                        metamaskButtons.push(element);
                                    }

                                    if (dataTestId && dataTestId.toLowerCase().includes('metamask')) {
                                        console.log(`在Shadow DOM深度 ${depth} 找到data-testid包含MetaMask的元素:`, element);
                                        metamaskButtons.push(element);
                                    }

                                    if (ariaLabel && ariaLabel.toLowerCase().includes('metamask')) {
                                        console.log(`在Shadow DOM深度 ${depth} 找到aria-label包含MetaMask的元素:`, element);
                                        metamaskButtons.push(element);
                                    }
                                }
                            });
                        }
                    }
                }
            }

            // 策略2: 查找更多的data-testid属性
            console.log('策略2: 查找更多的data-testid属性');
            const testIdSelectors = [
                '[data-testid*="metamask" i]',
                '[data-testid*="wallet" i]',
                '[data-testid*="connect" i]',
                '[data-testid="wallet-selector-io.metamask"]',
                '[data-testid="wallet-option-MetaMask"]',
                '[data-testid="wallet-option-metamask"]',
                '[data-testid="connector-metamask"]',
                '[data-testid="connector-MetaMask"]'
            ];

            for (const selector of testIdSelectors) {
                const elements = document.querySelectorAll(selector);
                console.log(`找到 ${elements.length} 个匹配 ${selector} 的元素`);

                for (const el of elements) {
                    const text = el.textContent || '';
                    if (text.toLowerCase().includes('metamask') || selector.toLowerCase().includes('metamask')) {
                        console.log(`找到匹配 ${selector} 的元素:`, el);
                        metamaskButtons.push(el);
                    }
                }
            }

            // 策略3: 全面扫描所有自定义元素的Shadow DOM
            console.log('策略3: 全面扫描所有自定义元素的Shadow DOM');
            // 查找所有自定义元素
            const customElements = Array.from(document.querySelectorAll('*'))
                .filter(el => el.tagName.includes('-'));
            console.log(`找到 ${customElements.length} 个自定义元素`);

            // 优先检查可能与Web3钱包相关的元素
            const walletRelatedElements = customElements.filter(el => {
                const tag = el.tagName.toLowerCase();
                return tag.includes('wallet') ||
                       tag.includes('web3') ||
                       tag.includes('connect') ||
                       tag.includes('w3m') ||
                       tag.includes('wui');
            });

            console.log(`找到 ${walletRelatedElements.length} 个可能与钱包相关的自定义元素`);

            for (const el of walletRelatedElements) {
                traverseShadowDOM(el, (element, depth) => {
                    // 检查元素文本是否包含MetaMask
                    const text = element.textContent || '';
                    if (text.toLowerCase().includes('metamask')) {
                        console.log(`在自定义元素 ${el.tagName} 的深度 ${depth} 找到包含MetaMask文本的元素:`, element);
                        metamaskButtons.push(element);
                    }

                    // 检查元素属性
                    if (element.getAttribute) {
                        const attrs = ['name', 'data-testid', 'aria-label', 'id', 'class'];
                        for (const attr of attrs) {
                            const value = element.getAttribute(attr);
                            if (value && value.toLowerCase().includes('metamask')) {
                                console.log(`在自定义元素 ${el.tagName} 的深度 ${depth} 找到${attr}包含MetaMask的元素:`, element);
                                metamaskButtons.push(element);
                            }
                        }
                    }

                    // 检查是否是按钮元素
                    if (element.tagName === 'BUTTON' ||
                        (element.getAttribute && element.getAttribute('role') === 'button')) {
                        const text = element.textContent || '';
                        if (text.toLowerCase().includes('metamask') ||
                            (element.getAttribute && element.getAttribute('name') === 'MetaMask')) {
                            console.log(`在自定义元素 ${el.tagName} 的深度 ${depth} 找到MetaMask按钮:`, element);
                            metamaskButtons.push(element);
                        }
                    }
                });
            }

            // 策略4: 查找特定的元素结构和属性
            console.log('策略4: 查找特定的元素结构和属性');
            const specificSelectors = [
                'wui-list-wallet',
                '[name="MetaMask"]',
                '[aria-label*="MetaMask" i]',
                '[aria-label*="钱包" i]',
                '[aria-label*="连接" i]',
                '[aria-label*="connect" i]',
                '[aria-label*="wallet" i]',
                'button:contains("MetaMask")',
                'div:contains("MetaMask")',
                'span:contains("MetaMask")'
            ];

            for (const selector of specificSelectors) {
                try {
                    // 对于:contains选择器需要特殊处理
                    if (selector.includes(':contains')) {
                        const [tagName, searchText] = selector.split(':contains');
                        const searchValue = searchText.replace(/["()]/g, '').toLowerCase();

                        const elements = Array.from(document.querySelectorAll(tagName))
                            .filter(el => (el.textContent || '').toLowerCase().includes(searchValue));

                        console.log(`找到 ${elements.length} 个包含文本 ${searchValue} 的 ${tagName} 元素`);
                        elements.forEach(el => metamaskButtons.push(el));
                    } else {
                        const elements = document.querySelectorAll(selector);
                        console.log(`找到 ${elements.length} 个匹配 ${selector} 的元素`);
                        elements.forEach(el => metamaskButtons.push(el));
                    }
                } catch (error) {
                    console.error(`使用选择器 ${selector} 查找元素时出错:`, error);
                }
            }

            // 过滤和排序找到的按钮
            console.log(`总共找到 ${metamaskButtons.length} 个可能的MetaMask按钮`);

            // 去重
            metamaskButtons = [...new Set(metamaskButtons)];
            console.log(`去重后剩余 ${metamaskButtons.length} 个按钮`);

            // 优先选择最可能是MetaMask按钮的元素
            const prioritizedButtons = metamaskButtons.filter(button => {
                try {
                    // 检查是否是按钮元素
                    if (button.tagName === 'BUTTON') return true;

                    // 检查是否有点击事件
                    if (button.onclick) return true;

                    // 检查是否有role="button"属性
                    if (button.getAttribute && button.getAttribute('role') === 'button') return true;

                    // 检查是否包含MetaMask文本
                    const text = button.textContent || '';
                    if (text.toLowerCase().includes('metamask')) return true;

                    // 检查是否有name="MetaMask"属性
                    if (button.getAttribute && button.getAttribute('name') === 'MetaMask') return true;

                    // 检查是否有data-testid包含metamask
                    if (button.getAttribute && button.getAttribute('data-testid') &&
                        button.getAttribute('data-testid').toLowerCase().includes('metamask')) return true;

                    return false;
                } catch (error) {
                    console.error('过滤按钮时出错:', error);
                    return false;
                }
            });

            console.log(`优先级过滤后剩余 ${prioritizedButtons.length} 个按钮`);

            if (prioritizedButtons.length > 0) {
                return prioritizedButtons[0]; // 返回第一个优先级高的按钮
            } else if (metamaskButtons.length > 0) {
                return metamaskButtons[0]; // 如果没有优先级高的，返回第一个找到的按钮
            }

            return null; // 没有找到任何按钮
        }

        // 尝试点击元素的辅助函数
        async function tryClickElement(element, description) {
            try {
                console.log(`尝试点击${description}:`, element);
                element.click();
                console.log(`成功点击${description}`);

                // 等待一段时间，看是否有反应
                await new Promise(resolve => setTimeout(resolve, 1500));
                return true;
            } catch (error) {
                console.error(`点击${description}失败:`, error);
                return false;
            }
        }

        // 尝试使用事件模拟点击的辅助函数
        async function tryEventClick(element, description) {
            try {
                console.log(`尝试使用事件模拟点击${description}`);
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(event);
                console.log(`成功使用事件模拟点击${description}`);

                // 等待一段时间，看是否有反应
                await new Promise(resolve => setTimeout(resolve, 1500));
                return true;
            } catch (error) {
                console.error(`事件模拟点击${description}失败:`, error);
                return false;
            }
        }

        // 尝试使用主函数查找并点击MetaMask按钮
        console.log('使用主函数查找MetaMask按钮');
        const button = await findMetaMaskButton();
        if (button) {
            console.log('主函数找到MetaMask按钮:', button);

            // 尝试直接点击
            if (await tryClickElement(button, 'MetaMask按钮')) {
                return 8888;
            }

            // 尝试事件模拟点击
            if (await tryEventClick(button, 'MetaMask按钮')) {
                return 8888;
            }

            // 如果有shadowRoot，尝试点击其中的按钮
            if (button.shadowRoot) {
                const innerButton = button.shadowRoot.querySelector('button');
                if (innerButton) {
                    console.log('找到shadowRoot中的button');

                    // 尝试直接点击
                    if (await tryClickElement(innerButton, 'shadowRoot中的button')) {
                        return 8888;
                    }

                    // 尝试事件模拟点击
                    if (await tryEventClick(innerButton, 'shadowRoot中的button')) {
                        return 8888;
                    }
                }
            }
        } else {
            console.log('主函数未找到MetaMask按钮');
        }

        // 最后的尝试: 遍历所有元素，查找包含MetaMask文本的元素
        console.log('最后尝试: 遍历所有元素，查找包含MetaMask文本的元素');
        try {
            const allElements = document.querySelectorAll('*');
            console.log(`页面上共有 ${allElements.length} 个元素`);

            for (const el of allElements) {
                const text = el.textContent || '';
                if (text.toLowerCase().includes('metamask')) {
                    console.log('找到包含MetaMask文本的元素:', el);
                    try {
                        el.click();
                        console.log('已点击元素');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return 8888;
                    } catch (error) {
                        console.error('点击元素失败:', error);

                        // 尝试使用事件模拟点击
                        try {
                            const event = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            el.dispatchEvent(event);
                            console.log('已使用事件模拟点击元素');
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            return 8888;
                        } catch (eventError) {
                            console.error('事件模拟点击元素失败:', eventError);
                        }
                    }
                }

                // 检查Shadow DOM
                if (el.shadowRoot) {
                    const shadowElements = el.shadowRoot.querySelectorAll('*');
                    console.log(`元素 ${el.tagName} 的shadowRoot中有 ${shadowElements.length} 个元素`);

                    for (const shadowEl of shadowElements) {
                        const shadowText = shadowEl.textContent || '';
                        if (shadowText.toLowerCase().includes('metamask')) {
                            console.log('在shadowRoot中找到包含MetaMask文本的元素:', shadowEl);
                            try {
                                shadowEl.click();
                                console.log('已点击shadowRoot中的元素');
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                return 8888;
                            } catch (error) {
                                console.error('点击shadowRoot中的元素失败:', error);

                                // 尝试使用事件模拟点击
                                try {
                                    const event = new MouseEvent('click', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window
                                    });
                                    shadowEl.dispatchEvent(event);
                                    console.log('已使用事件模拟点击shadowRoot中的元素');
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    return 8888;
                                } catch (eventError) {
                                    console.error('事件模拟点击shadowRoot中的元素失败:', eventError);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('遍历所有元素时出错:', error);
        }

        console.log('所有方法都未能找到并点击MetaMask按钮');
        return 0; // 未找到按钮

    } catch (error) {
        console.error('执行过程中发生错误:', error.message);
        console.error('错误堆栈:', error.stack);
        return 0; // 发生错误时返回0
    }
    }

    // 创建一个循环函数，每15秒执行一次点击操作，直到成功
    async function startClickLoop() {
        console.log('开始循环执行点击操作，每15秒一次，直到成功...');
        let attemptCount = 0;

        // 使用while循环确保持续尝试直到成功
        while (true) {
            attemptCount++;
            console.log(`第 ${attemptCount} 次尝试点击MetaMask按钮...`);

            // 执行点击操作
            const result = await executeClickOperation();

            // 检查是否成功
            if (result === 8888) {
                console.log(`成功点击MetaMask按钮！总共尝试了 ${attemptCount} 次`);
                return result; // 成功时返回结果并退出循环
            }

            console.log(`第 ${attemptCount} 次尝试失败，15秒后重试...`);

            // 等待15秒后再次尝试
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }

    // 启动循环
    return await startClickLoop();
})();