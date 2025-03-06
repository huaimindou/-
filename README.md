# 抖音视频下载与语音转文本工具

这是一个用于下载抖音视频并将其语音内容转换为文本的工具。该工具由前端界面和Python后端服务组成。

## 功能特点

- 通过抖音分享链接下载无水印视频
- 从视频中提取音频并转换为文本
- 支持复制和保存转换后的文本

## 安装步骤

### 1. 安装Python依赖

```bash
pip install flask flask-cors requests
```

### 2. 安装FFmpeg

语音提取功能需要FFmpeg支持。

- **macOS**：使用Homebrew安装
  ```bash
  brew install ffmpeg
  ```

- **Windows**：从[FFmpeg官网](https://ffmpeg.org/download.html)下载并安装

- **Linux**：使用包管理器安装
  ```bash
  sudo apt update && sudo apt install ffmpeg  # Ubuntu/Debian
  sudo yum install ffmpeg  # CentOS/RHEL
  ```

### 3. 语音识别API（可选）

目前，该工具使用模拟的语音识别结果。如需实现真实的语音识别功能，您需要：

1. 注册[百度AI开放平台](https://ai.baidu.com/)账号
2. 创建语音识别应用并获取API密钥
3. 在`server.py`中替换相应的API调用代码

## 使用方法

### 1. 启动后端服务

```bash
python server.py
```

服务将在 http://localhost:5000 上运行。

### 2. 启动前端界面

您可以使用任何HTTP服务器来提供前端文件，例如：

```bash
python -m http.server 8080
```

然后在浏览器中访问 http://localhost:8080

### 3. 使用工具

1. 在输入框中粘贴抖音视频链接
2. 点击"下载视频"按钮
3. 等待视频下载完成后，点击"转换语音为文本"按钮
4. 转换完成后，可以复制或保存文本结果

## 注意事项

- 本工具仅供学习和个人使用
- 请勿用于任何商业用途
- 下载的视频和音频文件会临时存储在系统临时目录中

## 技术实现

- 前端：HTML, CSS, JavaScript
- 后端：Python Flask
- 视频处理：FFmpeg
- 语音识别：需要集成第三方API（如百度语音识别）

## 许可证

MIT License