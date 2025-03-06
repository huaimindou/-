from flask import Flask, request, jsonify, send_file
import requests
import re
import os
import uuid
import tempfile
import subprocess
import json
import time
from flask_cors import CORS
from aip import AipSpeech

# 请先安装所需依赖:
# pip install flask flask-cors requests baidu-aip
# 同时确保系统已安装FFmpeg

# 百度语音识别API配置
# 请替换为您在百度AI开放平台申请的API密钥
# 申请地址：https://ai.baidu.com/tech/speech
APP_ID = 'your_app_id'
API_KEY = 'your_api_key'
SECRET_KEY = 'your_secret_key'

# 初始化百度语音识别客户端
client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)

app = Flask(__name__)
CORS(app)  # 启用CORS以允许前端访问

# 临时文件存储目录
TEMP_DIR = tempfile.gettempdir()

@app.route('/')
def index():
    return "抖音视频下载与语音转文本API服务正在运行"

@app.route('/api/douyin/download', methods=['POST'])
def download_douyin_video():
    try:
        data = request.json
        douyin_url = data.get('url')
        
        if not douyin_url:
            return jsonify({'success': False, 'message': '请提供抖音视频链接'})
        
        # 步骤1: 获取重定向后的URL
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://www.douyin.com/'
        }
        
        response = requests.get(douyin_url, headers=headers, allow_redirects=True)
        final_url = response.url
        
        # 步骤2: 从页面内容中提取视频ID
        video_id = None
        if 'modal_id=' in final_url:
            video_id = final_url.split('modal_id=')[1].split('&')[0]
        else:
            # 尝试从HTML内容中提取视频ID
            match = re.search(r'"itemId":"([0-9]+)"', response.text)
            if match:
                video_id = match.group(1)
        
        if not video_id:
            return jsonify({'success': False, 'message': '无法提取视频ID'})
        
        # 步骤3: 使用视频ID构建API请求获取无水印视频URL
        api_url = f"https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids={video_id}"
        api_response = requests.get(api_url, headers=headers)
        video_data = api_response.json()
        
        # 提取无水印视频URL
        try:
            video_url = video_data['item_list'][0]['video']['play_addr']['url_list'][0]
            # 替换域名以获取无水印版本
            video_url = video_url.replace('playwm', 'play')
        except (KeyError, IndexError):
            return jsonify({'success': False, 'message': '无法获取视频URL'})
        
        # 步骤4: 下载视频到临时文件
        video_filename = f"douyin_{video_id}_{uuid.uuid4().hex}.mp4"
        video_path = os.path.join(TEMP_DIR, video_filename)
        
        video_response = requests.get(video_url, headers=headers)
        with open(video_path, 'wb') as f:
            f.write(video_response.content)
        
        # 返回视频文件的相对路径和URL
        video_url_for_client = f"/api/videos/{video_filename}"
        
        return jsonify({
            'success': True, 
            'videoUrl': video_url_for_client,
            'videoId': video_id,
            'videoPath': video_path  # 这个路径在服务器端使用，不暴露给客户端
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'下载失败: {str(e)}'})

@app.route('/api/videos/<filename>')
def serve_video(filename):
    """提供视频文件的访问"""
    video_path = os.path.join(TEMP_DIR, filename)
    if os.path.exists(video_path):
        return send_file(video_path, mimetype='video/mp4')
    else:
        return jsonify({'success': False, 'message': '视频文件不存在'}), 404

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        data = request.json
        video_url = data.get('videoUrl')  # 从客户端获取视频URL
        video_id = data.get('videoId')  # 从客户端获取视频ID
        
        if not video_url:
            return jsonify({'success': False, 'message': '视频URL不能为空'})
            
        # 从URL中提取文件名
        filename = video_url.split('/')[-1]
        video_path = os.path.join(TEMP_DIR, filename)
        
        if not os.path.exists(video_path):
            return jsonify({'success': False, 'message': '视频文件不存在或已被删除'})
        
        # 步骤1: 从视频中提取音频
        audio_filename = f"audio_{uuid.uuid4().hex}.wav"
        audio_path = os.path.join(TEMP_DIR, audio_filename)
        
        # 使用ffmpeg提取音频
        ffmpeg_cmd = [
            'ffmpeg', '-i', video_path, 
            '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1',
            audio_path
        ]
        
        subprocess.run(ffmpeg_cmd, check=True)
        
        # 步骤2: 使用百度语音识别API
        # 注意: 这里需要替换为您自己的百度语音识别API密钥
        # 以下是使用百度API的示例代码，实际使用时需要替换为您的API密钥
        
        # 模拟语音识别结果
        # 在实际项目中，这里应该调用真实的语音识别API
        # 例如百度语音识别API: https://ai.baidu.com/tech/speech
        
        # 模拟处理时间
        time.sleep(2)
        
        # 模拟识别结果
        transcription_result = "这是一个从抖音视频中提取的语音内容。\n\n在实际项目中，这里将是通过调用百度、讯飞或Google等语音识别API得到的真实转录文本。\n\n要获取真实结果，您需要：\n1. 注册百度AI开放平台账号\n2. 创建语音识别应用并获取API密钥\n3. 使用API密钥调用百度语音识别服务"
        
        # 清理临时音频文件
        if os.path.exists(audio_path):
            os.remove(audio_path)
        
        return jsonify({
            'success': True,
            'text': transcription_result
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'转换失败: {str(e)}'})

# 定期清理临时文件的函数（实际项目中可以使用定时任务）
def cleanup_temp_files():
    # 实现定期清理临时文件的逻辑
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)