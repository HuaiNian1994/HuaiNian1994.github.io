## SEO

- meta标签

```html
<meta
  name="description"
  content="彩云科技致力于研究和应用人工智能技术服务大众。旗下有针对终端用户的app和面向开发者的开放平台。彩云小译－边说边译的同声传译，彩云天气－预报几点几分下雨和15天雾霾趋势。"
/>
<meta
  name="keywords"
  content="人工智能,翻译,同声传译,精准短时预报,气象雷达,分钟级数据更新,精准定位,空气质量,雾霾地图,天气预报API,预报API,分钟级,街道级,精细化,
  精准预报,天气预报,深度学习,机器学习,云图,污染,温度,生活,日历,雨时,下雨,户外,运动,旅行,助手,万年历,PM2.5,台风,冰雹,灾害,实时"
/>
<!--阻止爬虫爬取-->
<meta name="robots" content="noindex,nofollow">
```

- link标签

  - 对于有多个URL的产品，为这些URL对应的每个页面都指定相同的规范URL，避免搜索引擎视为重复内容降低网站排名，并指向某个空白页面（为防止其他网站将它的主页镜像或者进行恶意克隆）

    ~~~html
    <!--举例：canonical在谷歌首页的应用-->
    <link rel="canonical" href="https://ogs.google.com/widget/app">
    ~~~

    

- SSR

- 骨架屏

- 数据标记语言HTML Microdata、JSON-LD、RDFa

