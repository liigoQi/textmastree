
import LZString from 'lz-string';
import { TreeData, TreeChar, TreeRow } from '../types';

/**
 * 将圣诞树数据编码为 URL 安全的字符串
 */
export const encodeTreeData = (data: TreeData): string => {
  const json = JSON.stringify(data);
  // 使用 compressToEncodedURIComponent 确保在 URL 中安全传输
  return LZString.compressToEncodedURIComponent(json);
};

/**
 * 从 URL 安全的字符串解码圣诞树数据
 */
export const decodeTreeData = (encoded: string): TreeData | null => {
  if (!encoded) return null;
  try {
    // 尝试直接解压
    let json = LZString.decompressFromEncodedURIComponent(encoded);
    
    // 兼容性处理：如果解压失败，尝试对已编码的字符串进行一次 decodeURIComponent
    if (!json) {
      const decodedParam = decodeURIComponent(encoded);
      json = LZString.decompressFromEncodedURIComponent(decodedParam);
    }

    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error('解码圣诞树数据失败:', e);
    return null;
  }
};

/**
 * 算法：将字符串排列成三角形（圣诞树形状）
 */
export function buildTreeLayout(data: TreeData): TreeRow[] {
  const cleanContent = data.c.replace(/\s+/g, ''); // 移除所有空白字符以便排版
  if (cleanContent.length === 0) return [];

  let contentToUse = cleanContent;
  // 如果文本太短，重复填充以形成好看的树形
  const minChars = 55;
  if (contentToUse.length < minChars) {
    while (contentToUse.length < minChars) {
      contentToUse += cleanContent;
    }
  }

  const rows: TreeRow[] = [];
  let charPtr = 0;
  let rowNum = 1;

  while (charPtr < contentToUse.length) {
    const row: TreeChar[] = [];
    for (let i = 0; i < rowNum; i++) {
      if (charPtr < contentToUse.length) {
        const char = contentToUse[charPtr];
        row.push({
          char,
          index: charPtr,
          isHighlight: data.h.includes(charPtr)
        });
        charPtr++;
      } else {
        break;
      }
    }
    rows.push(row);
    rowNum++;
    
    // 防止无限循环或过大的树
    if (rowNum > 50) break;
  }

  return rows;
}

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 备用方案
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
