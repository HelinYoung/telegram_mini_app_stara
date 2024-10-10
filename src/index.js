const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 模拟数据存储
const coins = [
  { id: 'bitcoin', name: 'Bitcoin', ratings: [5, 4,3.5] },  // 默认评分
  { id: 'ethereum', name: 'Ethereum', ratings: [3, 4,3.5] },
  { id: 'litecoin', name: 'Litecoin', ratings: [2, 3,3.5] }
];

// API 路由：获取所有币种
app.get('/api/coins', (req, res) => {
  const result = coins.map(coin => {
    const average = coin.ratings.length 
      ? coin.ratings.reduce((a, b) => a + b, 0) / coin.ratings.length 
      : 0;
    return { id: coin.id, name: coin.name, averageRating: average };
  });
  res.json(result);
});
// API 路由：获取某个币种的平均分
app.get('/api/coins/:id/average', (req, res) => {
  const coin = coins.find(c => c.id === req.params.id);
  if (!coin) return res.status(404).send('Coin not found');
  const average = coin.ratings.length ? coin.ratings.reduce((a, b) => a + b, 0) / coin.ratings.length : 0;
  res.json({ average });
});

// API 路由：提交打分
app.post('/api/coins/:id/rate', (req, res) => {
  const coin = coins.find(c => c.id === req.params.id);
  if (!coin) return res.status(404).send('Coin not found');
  const { rating } = req.body;
  if (rating < 1 || rating > 5) return res.status(400).send('Invalid rating');
  coin.ratings.push(parseInt(rating, 10));
  const newAverage = coin.ratings.reduce((a, b) => a + b, 0) / coin.ratings.length;
  res.json({ newAverage });
});

// 静态文件托管
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 处理 React 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


