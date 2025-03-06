document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const transcribeBtn = document.getElementById('transcribe-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn');
    const videoPlayer = document.getElementById('video-player');
    const textOutput = document.getElementById('text-output');
    const progressBar = document.getElementById('download-progress');
    const progressText = document.getElementById('progress-text');
    const uploadBtn = document.getElementById('upload-btn');
    const videoFileInput = document.getElementById('video-file');
    
    // 视频URL存储
    let videoUrl = '';
    let videoBlob = null;
    
    // 转换语音为文本按钮点击事件
    transcribeBtn.addEventListener('click', function() {
        if (!videoUrl) {
            alert('请先上传视频');
            return;
        }
        
        progressText.textContent = '正在转换语音为文本...';
        progressBar.style.width = '50%';
        
        // 调用模拟转换函数
        simulateTranscription();
    });
    
    // 复制文本按钮点击事件
    copyBtn.addEventListener('click', function() {
        const text = textOutput.value;
        if (!text) return;
        
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('文本已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制');
            });
    });
    
    // 保存文件按钮点击事件
    saveBtn.addEventListener('click', function() {
        const text = textOutput.value;
        if (!text) return;
        
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '视频文本_' + new Date().getTime() + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // 模拟语音转文本过程（实际项目中需要替换为真实的API调用）
    function simulateTranscription() {
        // 重置按钮状态
        copyBtn.disabled = true;
        saveBtn.disabled = true;
        
        let progress = 50;
        const interval = setInterval(() => {
            progress += 2;
            progressBar.style.width = progress + '%';
            progressText.textContent = '转换中: ' + progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = '转换完成';
                
                // 模拟转换结果
                // 在实际项目中，这里应该是从语音识别API获取到的真实文本
                const transcriptionResult = '这是一个示例的语音转文本结果。在实际项目中，这里将显示从视频中提取出的真实语音内容。\n\n语音识别技术可以将语音信号转换为文字，广泛应用于语音助手、会议记录、字幕生成等场景。\n\n要实现真实的语音转文本功能，您需要使用专业的语音识别API，如百度语音识别、讯飞语音识别、Google Speech-to-Text等服务。';
                
                textOutput.value = transcriptionResult;
                
                // 启用复制和保存按钮
                copyBtn.disabled = false;
                saveBtn.disabled = false;
            }
        }, 100);
    }
    
    // 上传按钮点击事件
    uploadBtn.addEventListener('click', () => {
        const file = videoFileInput.files[0]; // 获取用户选择的文件
    
        if (file) {
            // 重置按钮状态
            transcribeBtn.disabled = true;
            copyBtn.disabled = true;
            saveBtn.disabled = true;
            
            // 显示上传进度
            progressText.textContent = '正在处理视频...';
            progressBar.style.width = '10%';
            
            // 模拟上传进度
            let progress = 10;
            const interval = setInterval(() => {
                progress += 5;
                progressBar.style.width = progress + '%';
                progressText.textContent = '处理中: ' + progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    progressText.textContent = '视频处理完成';
                    
                    // 创建文件的临时URL
                    videoUrl = URL.createObjectURL(file);
                    videoPlayer.src = videoUrl;
                    videoPlayer.load();
                    
                    // 启用转换按钮
                    transcribeBtn.disabled = false;
                }
            }, 100);
        } else {
            alert('请先选择一个视频文件！');
        }
    });
});