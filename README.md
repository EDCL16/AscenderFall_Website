# AscenderFall Website

[AscenderFall 網站連結](https://edcl16.github.io/AscenderFall_Website/)。

純靜態網站（HTML／CSS／JS），無框架、無建置步驟。

## 檢查

需要 Node.js 與 make。第一次使用先安裝工具：

```
npm ci
```

```
make check   # 檢查格式、HTML、JS 語法
make fmt     # 自動修正格式
```

## 部署

推送到 `main` 後，GitHub Actions 會自動部署到 GitHub Pages。
