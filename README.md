This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Running the tiles
in backend: uvicorn tiles:app --host 0.0.0.0 --port 8080
uvicorn tiles2:app --host 0.0.0.0 --port 8080 --reload
in wsi-browser: npm run dev

## Serving tiles here: 
## MAKE IT SO THAT IF THE NGINX SERVER IS DOWN THEN BACKUP SHOULD BE NORMAL TILE REQUESTS
http://localhost:8080/tiles/wsi/tif/test_001.tif/3/8/8.png

use this to check if fastapi is running: curl.exe http://localhost:8080/tiles/wsi/tif/test_004.tif/7/149/111.png

NGINX:
sudo nano /etc/nginx/sites-available/default

sudo chown -R www-data:www-data /var/cache/nginx
sudo chmod -R 755 /var/cache/nginx
sudo ls -ld /var/cache/nginx
sudo nginx -t
sudo service nginx restart

use this to check if nginx is working: curl -I http://localhost/tiles/wsi/tif/test_004.tif/7/149/111.png

## WSL infinite hang: 
taskkill /IM wslservice.exe /F

## Activate venv (if imports arent working, pip install in env in bash): 
source ./venv/Scripts/activate

## Do this in WSL:
sudo apt-get update
sudo apt install docker.io
or
sudo apt-get install -y docker.io
sudo apt install docker-buildx
sudo dockerd (runs in foreground)
make image
sudo apt-get install gdebi-core
make install_isyntax_sdk
docker run -it preprocessor /bin/bash 
or
docker run -it --name iSyntax-container preprocessor bash
sudo dpkg -i preprocessorMain/libraries/philips-pathology-sdk/*.deb

pip install -r requirements.txt

docker cp /mnt/c/Users/anuks/Documents/Y4/CS4099/CS4099-Code/wsi-browser/backend/preprocessorMain/libraries 53533769c10f:/workspace/preprocessor/libraries

export PATH=$PATH:/home/as602/.local/bin

docker run -it --name iSyntax-container -v /mnt/c/Users/anuks/Documents/Y4/CS4099/CS4099-Code/wsi-browser:/workspace/preprocessor preprocessor bash

in backend:
ldd /usr/local/lib/libsoftwarerendercontext.so (checks if dependencies are missing)
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo apt-get install -y liblcms2-2

apt-get install -y openslide-tools libopenslide0

libffi.so.6:
wget http://archive.ubuntu.com/ubuntu/pool/main/libf/libffi/libffi6_3.2.1-8_amd64.deb
dpkg -i libffi6_3.2.1-8_amd64.deb
apt-get install -f
ldconfig -p | grep libffi

pip install openslide-python

export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

nm -D /usr/local/lib/libsoftwarerendercontext.so.2.1.1 | grep SoftwareRenderContext
nm -D /usr/local/lib/libsoftwarerenderbackend.so.2.1.1 | grep SoftwareRenderBackend

## To forward port from docker to host machine while copying the whole directory:
docker run -it --name iSyntax-container -p 8080:8080 -v /mnt/c/Users/anuks/Documents/Y4/CS4099/CS4099-Code/wsi-browser:/workspace/preprocessor preprocessor bash 

## in 18.04
docker run -it --name iSyntax-container -p 8080:8080 -v /mnt/c/Users/anuks/Documents/Y4/CS4099/CS4099-Code/wsi-browser:/workspace/preprocessor ubuntu:18.04 /bin/bash

nm -D /workspace/preprocessor/backend/preprocessorMain/libraries/philips-pathology-sdk/extracted/usr/local/lib/libsoftwarerenderbackend.so.2.1.1 | grep SoftwareRenderBackend