/**
 * Document Analyzer Agent
 * 
 * This script handles document uploads, performs analysis, and generates PDF reports.
 */

// Import required libraries
const pdfLib = {
  create: async (content, options) => {
    console.log('Creating PDF with content:', content);
    // In a real implementation, this would use a library like jsPDF or PDFKit
    return new Blob(['PDF content'], { type: 'application/pdf' });
  }
};

class DocumentAnalyzer {
  constructor() {
    this.initializeUI();
    this.bindEvents();
  }

  initializeUI() {
    // Create UI elements if they don't exist
    if (!document.getElementById('document-analyzer')) {
      const analyzerContainer = document.createElement('div');
      analyzerContainer.id = 'document-analyzer';
      analyzerContainer.className = 'analyzer-container';
      
      analyzerContainer.innerHTML = `
        <div class="analyzer-header">
          <h2>文档分析工具</h2>
          <p>上传文档进行智能分析，并获取PDF格式的分析报告</p>
        </div>
        
        <div class="upload-area" id="upload-area">
          <div class="upload-icon">📄</div>
          <p>拖放文件到此处或<label for="file-input" class="file-label">选择文件</label></p>
          <input type="file" id="file-input" accept=".doc,.docx,.pdf,.txt" multiple />
        </div>
        
        <div class="analysis-options">
          <h3>分析选项</h3>
          <div class="option-group">
            <label>
              <input type="checkbox" id="option-summary" checked />
              生成摘要
            </label>
            <label>
              <input type="checkbox" id="option-keywords" checked />
              提取关键词
            </label>
            <label>
              <input type="checkbox" id="option-sentiment" checked />
              情感分析
            </label>
            <label>
              <input type="checkbox" id="option-entities" checked />
              实体识别
            </label>
          </div>
        </div>
        
        <button id="analyze-btn" class="analyze-btn" disabled>开始分析</button>
        
        <div class="results-area" id="results-area" style="display: none;">
          <div class="results-header">
            <h3>分析结果</h3>
            <button id="download-pdf-btn" class="download-btn">下载PDF报告</button>
          </div>
          <div class="results-content" id="results-content"></div>
        </div>
      `;
      
      document.body.appendChild(analyzerContainer);
      
      // Add styles
      if (!document.getElementById('analyzer-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'analyzer-styles';
        styleElement.textContent = `
          .analyzer-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 30px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            font-family: 'Noto Sans SC', sans-serif;
          }
          
          .analyzer-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .analyzer-header h2 {
            color: #0084FF;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .analyzer-header p {
            color: #5f6368;
            font-size: 16px;
          }
          
          .upload-area {
            border: 2px dashed #e8eaed;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            margin-bottom: 30px;
            transition: all 0.3s ease;
            background: #f8f9fa;
          }
          
          .upload-area.drag-over {
            border-color: #0084FF;
            background: rgba(0, 132, 255, 0.05);
          }
          
          .upload-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          
          .file-label {
            color: #0084FF;
            cursor: pointer;
            font-weight: 500;
          }
          
          #file-input {
            display: none;
          }
          
          .analysis-options {
            margin-bottom: 30px;
          }
          
          .analysis-options h3 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #202124;
          }
          
          .option-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          
          .option-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 8px 16px;
            background: #f1f3f4;
            border-radius: 20px;
            transition: all 0.2s ease;
          }
          
          .option-group label:hover {
            background: #e8eaed;
          }
          
          .analyze-btn {
            background: linear-gradient(45deg, #0084FF, #0073E6);
            color: white;
            border: none;
            padding: 14px 30px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            width: 100%;
            box-shadow: 0 4px 12px rgba(0, 132, 255, 0.2);
          }
          
          .analyze-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 132, 255, 0.3);
          }
          
          .analyze-btn:disabled {
            background: #e8eaed;
            color: #9aa0a6;
            cursor: not-allowed;
            box-shadow: none;
          }
          
          .results-area {
            margin-top: 40px;
            border-top: 1px solid #e8eaed;
            padding-top: 30px;
          }
          
          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .results-header h3 {
            font-size: 18px;
            color: #202124;
          }
          
          .download-btn {
            background: #0084FF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .download-btn:hover {
            background: #0073E6;
          }
          
          .download-btn::before {
            content: "📥";
          }
          
          .results-content {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
          }
          
          .result-section {
            margin-bottom: 20px;
          }
          
          .result-section h4 {
            font-size: 16px;
            color: #0084FF;
            margin-bottom: 10px;
          }
          
          .keywords-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .keyword-tag {
            background: rgba(0, 132, 255, 0.1);
            color: #0084FF;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 14px;
          }
          
          .sentiment-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .sentiment-bar {
            flex-grow: 1;
            height: 8px;
            background: #e8eaed;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
          }
          
          .sentiment-value {
            position: absolute;
            height: 100%;
            background: linear-gradient(90deg, #FF6B6B, #FFD166, #06D6A0);
            border-radius: 4px;
          }
          
          .entities-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .entities-table th, .entities-table td {
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid #e8eaed;
          }
          
          .entities-table th {
            font-weight: 500;
            color: #5f6368;
          }
          
          .file-list {
            margin-bottom: 20px;
          }
          
          .file-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #f1f3f4;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          
          .file-icon {
            font-size: 20px;
          }
          
          .file-name {
            flex-grow: 1;
          }
          
          .file-remove {
            background: none;
            border: none;
            color: #5f6368;
            cursor: pointer;
            font-size: 18px;
            transition: color 0.2s ease;
          }
          
          .file-remove:hover {
            color: #d93025;
          }
          
          .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 132, 255, 0.1);
            border-left-color: #0084FF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(styleElement);
      }
    }
  }

  bindEvents() {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    const analyzeBtn = document.getElementById('analyze-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    
    // File selection via input
    fileInput.addEventListener('change', (e) => {
      this.handleFileSelection(e.target.files);
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      this.handleFileSelection(e.dataTransfer.files);
    });
    
    // Analyze button
    analyzeBtn.addEventListener('click', () => {
      this.analyzeDocuments();
    });
    
    // Download PDF button
    downloadPdfBtn.addEventListener('click', () => {
      this.generatePDF();
    });
  }

  handleFileSelection(files) {
    if (!files || files.length === 0) return;
    
    const uploadArea = document.getElementById('upload-area');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Create file list if it doesn't exist
    let fileList = uploadArea.querySelector('.file-list');
    if (!fileList) {
      fileList = document.createElement('div');
      fileList.className = 'file-list';
      uploadArea.appendChild(fileList);
    }
    
    // Add files to the list
    Array.from(files).forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      // Determine file icon based on type
      let fileIcon = '📄';
      if (file.name.endsWith('.pdf')) fileIcon = '📕';
      else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileIcon = '📘';
      else if (file.name.endsWith('.txt')) fileIcon = '📝';
      
      fileItem.innerHTML = `
        <div class="file-icon">${fileIcon}</div>
        <div class="file-name">${file.name}</div>
        <button class="file-remove" data-filename="${file.name}">×</button>
      `;
      
      fileList.appendChild(fileItem);
      
      // Store file in the instance
      if (!this.files) this.files = [];
      this.files.push(file);
    });
    
    // Add event listeners to remove buttons
    const removeButtons = fileList.querySelectorAll('.file-remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filename = e.target.getAttribute('data-filename');
        this.removeFile(filename, e.target.closest('.file-item'));
      });
    });
    
    // Enable analyze button
    analyzeBtn.disabled = false;
  }

  removeFile(filename, fileElement) {
    // Remove file from the array
    if (this.files) {
      this.files = this.files.filter(file => file.name !== filename);
    }
    
    // Remove file element from the UI
    fileElement.remove();
    
    // Disable analyze button if no files left
    const analyzeBtn = document.getElementById('analyze-btn');
    if (!this.files || this.files.length === 0) {
      analyzeBtn.disabled = true;
      
      // Remove file list if empty
      const fileList = document.querySelector('.file-list');
      if (fileList && fileList.children.length === 0) {
        fileList.remove();
      }
    }
  }

  async analyzeDocuments() {
    if (!this.files || this.files.length === 0) return;
    
    const resultsArea = document.getElementById('results-area');
    const resultsContent = document.getElementById('results-content');
    
    // Show loading indicator
    resultsContent.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>正在分析文档，请稍候...</p>
      </div>
    `;
    resultsArea.style.display = 'block';
    
    // Get selected options
    const options = {
      summary: document.getElementById('option-summary').checked,
      keywords: document.getElementById('option-keywords').checked,
      sentiment: document.getElementById('option-sentiment').checked,
      entities: document.getElementById('option-entities').checked
    };
    
    try {
      // Simulate document analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock analysis results
      const results = this.generateMockResults(options);
      
      // Display results
      this.displayResults(results);
      
      // Store results for PDF generation
      this.analysisResults = results;
    } catch (error) {
      console.error('Analysis error:', error);
      resultsContent.innerHTML = `
        <div class="error-message">
          <p>分析过程中出现错误，请重试。</p>
          <p>错误详情: ${error.message}</p>
        </div>
      `;
    }
  }

  generateMockResults(options) {
    const results = {
      files: this.files.map(file => file.name),
      timestamp: new Date().toLocaleString()
    };
    
    if (options.summary) {
      results.summary = '这是一份关于文档内容的自动生成摘要。该文档主要讨论了人工智能在现代商业环境中的应用，特别是在客户服务、数据分析和预测性维护方面的优势。文档还探讨了实施AI解决方案时的常见挑战和最佳实践。';
    }
    
    if (options.keywords) {
      results.keywords = ['人工智能', '机器学习', '数据分析', '客户服务', '预测性维护', '商业智能', '自动化', '数字化转型'];
    }
    
    if (options.sentiment) {
      results.sentiment = {
        score: 0.65, // 0 to 1 scale
        label: '积极'
      };
    }
    
    if (options.entities) {
      results.entities = [
        { name: '谷歌', type: '组织', count: 12 },
        { name: '微软', type: '组织', count: 8 },
        { name: '亚马逊', type: '组织', count: 6 },
        { name: '张三', type: '人物', count: 4 },
        { name: '北京', type: '地点', count: 7 }
      ];
    }
    
    return results;
  }

  displayResults(results) {
    const resultsContent = document.getElementById('results-content');
    
    let html = `
      <div class="result-meta">
        <p><strong>分析时间:</strong> ${results.timestamp}</p>
        <p><strong>分析文件:</strong> ${results.files.join(', ')}</p>
      </div>
    `;
    
    if (results.summary) {
      html += `
        <div class="result-section">
          <h4>文档摘要</h4>
          <p>${results.summary}</p>
        </div>
      `;
    }
    
    if (results.keywords) {
      html += `
        <div class="result-section">
          <h4>关键词</h4>
          <div class="keywords-list">
            ${results.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
          </div>
        </div>
      `;
    }
    
    if (results.sentiment) {
      const sentimentPercentage = results.sentiment.score * 100;
      html += `
        <div class="result-section">
          <h4>情感分析</h4>
          <div class="sentiment-indicator">
            <span>消极</span>
            <div class="sentiment-bar">
              <div class="sentiment-value" style="width: ${sentimentPercentage}%"></div>
            </div>
            <span>积极</span>
          </div>
          <p>整体情感倾向: <strong>${results.sentiment.label}</strong> (得分: ${results.sentiment.score.toFixed(2)})</p>
        </div>
      `;
    }
    
    if (results.entities) {
      html += `
        <div class="result-section">
          <h4>实体识别</h4>
          <table class="entities-table">
            <thead>
              <tr>
                <th>实体名称</th>
                <th>类型</th>
                <th>出现次数</th>
              </tr>
            </thead>
            <tbody>
              ${results.entities.map(entity => `
                <tr>
                  <td>${entity.name}</td>
                  <td>${entity.type}</td>
                  <td>${entity.count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    
    resultsContent.innerHTML = html;
  }

  async generatePDF() {
    if (!this.analysisResults) return;
    
    try {
      // Create a loading notification
      this.showNotification('正在生成PDF报告...', 'info');
      
      // Simulate PDF generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would use a PDF library to generate the PDF
      // For this demo, we'll just create a simple blob
      const pdfBlob = await pdfLib.create(this.analysisResults, {
        title: '文档分析报告',
        author: '贝壳OC文档分析工具',
        subject: '自动生成的文档分析报告'
      });
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `文档分析报告_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showNotification('PDF报告已成功生成并下载', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      this.showNotification('生成PDF报告时出错，请重试', 'error');
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.analyzer-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `analyzer-notification notification-${type}`;
    
    // Set icon based on type
    let icon = '💬';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'info') icon = 'ℹ️';
    
    notification.innerHTML = `
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.background = 'white';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.3s ease';
    
    if (type === 'success') {
      notification.style.borderLeft = '4px solid #06D6A0';
    } else if (type === 'error') {
      notification.style.borderLeft = '4px solid #EF476F';
    } else {
      notification.style.borderLeft = '4px solid #0084FF';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize the document analyzer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.documentAnalyzer = new DocumentAnalyzer();
});

// Add necessary animations
if (!document.getElementById('analyzer-animations')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'analyzer-animations';
  styleElement.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(10px); }
    }
  `;
  document.head.appendChild(styleElement);
}