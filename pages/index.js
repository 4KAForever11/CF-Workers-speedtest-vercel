// 首先定义所有的常量
const originalCSS = `
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        text-align: center;
        background-color: #141526;
        color: white;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: hidden;
    }
    
    .test-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px 0;
    }
    
    .speed-test-button {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 3px solid #00b3b3;
        background: none;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(0, 179, 179, 0.2);
    }
    
    .current-speed {
        font-size: 64px;
        color: #00b3b3;
        margin-bottom: 5px;
        font-weight: 300;
    }
    
    .speed-unit {
        font-size: 20px;
        color: #888;
        margin-bottom: 8px;
    }
    
    .test-status {
        font-size: 18px;
        color: #888;
    }
    
    .progress-ring {
        position: absolute;
        top: -3px;
        left: -3px;
        width: 300px;
        height: 300px;
        transform: rotate(-90deg);
        filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.3));
    }
    
    .progress-ring circle {
        r: 148.5;
        cx: 150;
        cy: 150;
        fill: none;
        stroke: #00b3b3;
        stroke-width: 6px;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.2s ease;
        filter: url(#glow);
    }
    
    .progress-ring circle {
        stroke: url(#gradient);
    }
    
    .progress-ring-background {
        position: absolute;
        top: -3px;
        left: -3px;
        width: 300px;
        height: 300px;
        transform: rotate(-90deg);
    }
    
    .progress-ring-background circle {
        r: 148.5;
        cx: 150;
        cy: 150;
        fill: none;
        stroke: rgba(0, 179, 179, 0.1);
        stroke-width: 6px;
        stroke-linecap: round;
    }
    
    .speed-test-button:hover {
        border-color: #00ffff;
        box-shadow: 0 0 30px rgba(0, 179, 179, 0.3);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .speed-test-button:not(:disabled) {
        animation: pulse 2s infinite;
    }
    
    .speed-results {
        margin-top: 40px;
    }
    
    .server-info {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .server-detail {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #888;
    }
    
    .server-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }
    
    .result {
        margin-top: 15px;
        font-size: 24px;
        color: #00b3b3;
    }
    
    .progress {
        margin-top: 10px;
        font-size: 16px;
        color: #888;
    }
    
    .speed-results {
        margin-top: 20px;
        display: flex;
        gap: 40px;
        justify-content: center;
    }
    
    .speed-item {
        text-align: center;
    }
    
    .speed-label {
        color: #888;
        font-size: 14px;
        margin-bottom: 5px;
    }
    
    .speed-value {
        color: #00b3b3;
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
    }
`;

const originalButtonHTML = `
    <svg class="progress-ring-background">
        <circle r="148.5" cx="150" cy="150"/>
    </svg>
    
    <svg class="progress-ring" id="progressRing">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00b3b3;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <circle r="148.5" cx="150" cy="150" 
                stroke-dasharray="933.5" 
                stroke-dashoffset="933.5" 
                id="progressCircle"/>
    </svg>
    
    <div class="current-speed" id="currentSpeed">开始</div>
    <div class="speed-unit" id="speedUnit"></div>
    <div class="test-status" id="testStatus"></div>
`;

const originalSpeedResultsHTML = `
    <div class="speed-item">
        <div class="speed-label">下载速度</div>
        <div class="speed-value" id="downloadResult">--</div>
        <div class="speed-unit">MB/s</div>
    </div>
    <div class="speed-item">
        <div class="speed-label">上传速度</div>
        <div class="speed-value" id="uploadResult">--</div>
        <div class="speed-unit">MB/s</div>
    </div>
`;

const HTML = `
<!DOCTYPE html>
<html>
<head>
    <title>网速测试</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${originalCSS}
    </style>
</head>
<body>
    <div class="test-area">
        <button id="testButton" class="speed-test-button" onclick="startTest()">
            ${originalButtonHTML}
        </button>
        <div class="progress" id="progress"></div>
        <div class="result" id="result"></div>
        <div class="speed-results" id="speedResults" style="display: none;">
            ${originalSpeedResultsHTML}
        </div>
    </div>
    
    <div class="server-info">
        <div class="server-detail">
            <div class="server-icon">VE</div>
            <div>
                <div>Vercel</div>
                <div id="serverId">Edge Functions</div>
            </div>
        </div>
        <div class="server-detail">
            <div class="server-icon">🌍</div>
            <div>
                <div id="serverLocation">自动选择</div>
            </div>
        </div>
    </div>

    <script>
        // JavaScript 代码部分
        ${getJavaScript()}
    </script>
</body>
</html>
`;

// JavaScript 代码
function getJavaScript() {
    return `
    let isTestRunning = false;
    let downloadSpeed = 0;
    let uploadSpeed = 0;
    
    function updateSpeed(speed, type) {
        const currentSpeed = document.getElementById('currentSpeed');
        const speedUnit = document.getElementById('speedUnit');
        const testStatus = document.getElementById('testStatus');
        
        if (currentSpeed && speedUnit && testStatus) {
            if (typeof speed === 'number' && speed > 0) {
                const speedMBps = (speed / 8).toFixed(2);
                currentSpeed.textContent = speedMBps;
                speedUnit.textContent = 'MB/s';
                testStatus.textContent = type + '测试中';
            }
        }
    }
    
    async function runSpeedTest(type, testFn) {
        const currentSpeed = document.getElementById('currentSpeed');
        const speedUnit = document.getElementById('speedUnit');
        const testStatus = document.getElementById('testStatus');
        
        currentSpeed.textContent = '0.00';
        speedUnit.textContent = 'MB/s';
        testStatus.textContent = type + '测试中';
        
        const speedMbps = await testFn();
        
        if (type === 'download') {
            downloadSpeed = speedMbps;
        } else {
            uploadSpeed = speedMbps;
        }
        
        return speedMbps;
    }
    
    async function startTest() {
        if (isTestRunning) return;
        
        const testButton = document.getElementById('testButton');
        const result = document.getElementById('result');
        const progressCircle = document.getElementById('progressCircle');
        const speedResults = document.getElementById('speedResults');
        const currentSpeed = document.getElementById('currentSpeed');
        const speedUnit = document.getElementById('speedUnit');
        const testStatus = document.getElementById('testStatus');
        
        currentSpeed.textContent = '准备中';
        speedUnit.textContent = '';
        testStatus.textContent = '';
        result.textContent = '';
        speedResults.style.display = 'none';
        isTestRunning = true;
        
        if (progressCircle) {
            progressCircle.style.strokeDasharray = '933.5';
            progressCircle.style.strokeDashoffset = '933.5';
        }
        
        try {
            // 下载测试
            await runSpeedTest('download', async () => {
                const size = 5 * 1024 * 1024;
                const response = await fetch('/api/speedtest?type=download&size=' + size);
                if (!response.ok) throw new Error('下载请求失败: ' + response.status);
                
                const reader = response.body.getReader();
                let receivedLength = 0;
                let lastUpdate = performance.now();
                let lastReceived = 0;
                let speeds = [];
                
                const startTime = performance.now();
                
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    receivedLength += value.length;
                    
                    const now = performance.now();
                    if (now - lastUpdate > 100) {
                        const duration = (now - lastUpdate) / 1000;
                        const currentSpeed = ((receivedLength - lastReceived) * 8 / duration / 1024 / 1024);
                        
                        speeds.push(currentSpeed);
                        if (speeds.length > 3) speeds.shift();
                        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
                        
                        const progress_percent = (receivedLength / size) * 100;
                        
                        updateUI(avgSpeed, progress_percent, '下载');
                        
                        lastUpdate = now;
                        lastReceived = receivedLength;
                    }
                }
                
                const duration = (performance.now() - startTime) / 1000;
                return (receivedLength * 8 / duration / 1024 / 1024);
            });
            
            // 上传测试
            await runSpeedTest('upload', async () => {
                const size = 5 * 1024 * 1024;
                const data = new Uint8Array(size);
                const chunkSize = 65536;
                let uploadedSize = 0;
                let lastUpdate = performance.now();
                let speeds = [];
                
                for (let i = 0; i < size; i += chunkSize) {
                    const chunk = new Uint8Array(Math.min(chunkSize, size - i));
                    crypto.getRandomValues(chunk);
                    data.set(chunk, i);
                }
                
                const startTime = performance.now();
                
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/speedtest?type=upload');
                    
                    xhr.upload.onprogress = (event) => {
                        const now = performance.now();
                        if (now - lastUpdate > 100) {
                            const duration = (now - lastUpdate) / 1000;
                            const currentSpeed = ((event.loaded - uploadedSize) * 8 / duration / 1024 / 1024);
                            
                            speeds.push(currentSpeed);
                            if (speeds.length > 3) speeds.shift();
                            const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
                            
                            const progress_percent = (event.loaded / event.total) * 100;
                            
                            updateUI(avgSpeed, progress_percent, '上传');
                            
                            lastUpdate = now;
                            uploadedSize = event.loaded;
                        }
                    };
                    
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            const duration = (performance.now() - startTime) / 1000;
                            resolve(size * 8 / duration / 1024 / 1024);
                        } else {
                            reject(new Error('上传失败: ' + xhr.status));
                        }
                    };
                    
                    xhr.onerror = () => reject(new Error('上传失败'));
                    xhr.send(data);
                });
            });
            
            currentSpeed.textContent = '再次测速';
            speedUnit.textContent = '';
            testStatus.textContent = '';
            showResults();
            
            if (progressCircle) {
                progressCircle.style.strokeDashoffset = '933.5';
            }
            
        } catch (error) {
            currentSpeed.textContent = '失败';
            speedUnit.textContent = '';
            testStatus.textContent = error.message;
            
            if (progressCircle) {
                progressCircle.style.strokeDashoffset = '933.5';
            }
        } finally {
            isTestRunning = false;
        }
    }
    
    function updateUI(speed, progress, type) {
        const currentSpeedElem = document.getElementById('currentSpeed');
        const speedUnitElem = document.getElementById('speedUnit');
        const testStatusElem = document.getElementById('testStatus');
        const progressCircle = document.getElementById('progressCircle');
        
        if (currentSpeedElem && speedUnitElem && testStatusElem) {
            currentSpeedElem.textContent = (speed / 8).toFixed(2);
            speedUnitElem.textContent = 'MB/s';
            testStatusElem.textContent = type + '测试中';
        }
        
        if (progressCircle) {
            progressCircle.style.strokeDashoffset = (933.5 - (progress / 100) * 933.5).toString();
        }
    }
    
    function showResults() {
        const speedResults = document.getElementById('speedResults');
        const downloadResult = document.getElementById('downloadResult');
        const uploadResult = document.getElementById('uploadResult');
        
        if (speedResults && downloadResult && uploadResult) {
            speedResults.style.display = 'flex';
            downloadResult.textContent = (downloadSpeed / 8).toFixed(2);
            uploadResult.textContent = (uploadSpeed / 8).toFixed(2);
        }
    }
    `;
}

// Next.js 组件
export default function Home() {
    return (
        <div dangerouslySetInnerHTML={{ __html: HTML }} />
    );
}