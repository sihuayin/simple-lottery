cd contract 
npx hardhat node

薪启动一个命令行窗口
npx hardhat run scripts/deploy/main.ts --network localhost

cd ../web
pnpm run dev

打开localhost:3000
链接 metaMask钱包
添加本地 http://127.0.0.1:8545/ 作为测试网
导入 打印出来的 Private key 作为账户

