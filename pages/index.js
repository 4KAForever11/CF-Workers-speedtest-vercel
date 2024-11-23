export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: HTML }} />
  );
}

const HTML = `
// 这里放入原来的HTML内容，但需要修改一些API路径
`.replace(/new URL\('(download|upload)',[^)]+\)\.href/g, '"/api/speedtest?type=$1"'); 