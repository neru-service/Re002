import { useState } from 'react';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

export default function Home() {
  const [creatorName, setCreatorName] = useState('');
  const [image, setImage] = useState('');

  const handleUpload = async () => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) throw err;

      // 保存された順番を取得
      const orderNumber = await getOrderNumber();

      // 画像の保存先パス
      const imagePath = path.join(__dirname, 'uploads', `${orderNumber}.png`);

      // 画像のアップロード
      fs.rename(files.image.path, imagePath, (err) => {
        if (err) throw err;
        console.log('File uploaded successfully!');
      });

      // db.txt への保存
      const dbPath = path.join(__dirname, 'db.txt');
      const dbContent = `${orderNumber} - ${fields.creatorName} - ${imagePath}\n`;

      fs.appendFile(dbPath, dbContent, (err) => {
        if (err) throw err;
        console.log('Data saved to db.txt');
      });
    });
  };

  const getOrderNumber = async () => {
    const dbPath = path.join(__dirname, 'db.txt');

    try {
      const data = await fs.promises.readFile(dbPath, 'utf-8');
      const lines = data.split('\n').filter(Boolean);
      return lines.length + 1;
    } catch (err) {
      // ファイルが存在しない場合は1を返す
      return 1;
    }
  };

  return (
    <div>
      <h1>Image Uploader</h1>
      <div>
        <label>
          Creator Name:
          <input type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Image:
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </label>
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
