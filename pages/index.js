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
    /* ... 其余的 CSS 样式 ... */
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

// 将 JavaScript 代码单独放在一个函数中
function getJavaScript() {
    return `
    let isTestRunning = false;
    let downloadSpeed = 0;
    let uploadSpeed = 0;
    
    // ... 其余的 JavaScript 代码 ...
    `;
}

// Next.js 组件
export default function Home() {
    return (
        <div dangerouslySetInnerHTML={{ __html: HTML }} />
    );
}