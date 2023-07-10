(async () => {
  const path = require("path");
  const fs = require("fs"); //require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象
  const dirReader = (docPath) => {
    return new Promise((resolve) => {
      fs.readdir(docPath, (err, data) => {
        resolve(data);
      });
    });
  };

  //判断文件的条件
  const judgeFile = {
    isMdDoc: (file) => file.endsWith(".md") && !["README.md", "_sidebar.md"].includes(file),
    isFolder: (file) => !file.includes(".") && !["Images", "images","img","IMG","Img"].includes(file),
  };
  //获取目标文件
  const getTargetFiles = async (path, judge = () => true) => (await dirReader(path)).filter((ele) => judge(ele));

  //获取一个文件夹下的md文件
  const getSingleFolderMds = async (folderPath) => {
    const mdDocs = await getTargetFiles(folderPath, judgeFile.isMdDoc);
    const mdCatalog = mdDocs
      .map((ele) => {
        const clip = ele.replace(".md", "");
        return `+ [${clip}](${folderPath.replace(__dirname, "") + clip})`;
      })
      .join("\r\n");
    return { mdDocs, mdCatalog };
  };

  //生成一个文件夹的目录信息
  const genSingleFolderCatalog = async (path) => {
    const { mdCatalog } = await getSingleFolderMds(path);
    const folders = await getTargetFiles(path, judgeFile.isFolder);
    const foldersCatalog = folders
      .map((folder) => {
        //对于每一个子文件夹 都需要为其生成描述文件_sidebar.md和README.md
        const nextPath = path + folder + "/";
        genDescDoc(nextPath, nextPath);
        return `+ [${folder}📁](${path.replace(__dirname, "") + folder + "/"})`;
      })
      .join("\r\n");
    return mdCatalog + "\r\n" + foldersCatalog;
  };

  //在一个文件夹写入描述文件：_sidebar.md和README.md
  const genDescDoc = async (genPath, docPath) => {
    const catalog = await genSingleFolderCatalog(docPath);
    fs.writeFile(genPath + "_sidebar.md", catalog, () => {});
    const hasREADME = (await getTargetFiles(genPath)).includes("README.md");
    if (!hasREADME) {
    let newPath = genPath.endsWith("/") ? genPath.slice(0, genPath.length - 1) : genPath;
    const p1 = "<p>当前位置：" + newPath.replace("D:\\Personal\\MY_DOC/docs", "首页").replace("D:\\Personal\\MY_DOC", "首页").split("/").join("->") + "</p>";
    const p2 = "<p>版本：init Version</p>";
    const READMEDefault = p1 + p2;
    fs.writeFile(genPath + "README.md", READMEDefault, () => {});
    }
  };

  const serveRoot = __dirname + "/";
  const docRoot = serveRoot + "docs/";
  // console.log("serveRoot ", serveRoot, docRoot);

  genDescDoc(serveRoot, docRoot);
})();
