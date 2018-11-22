NODE="nodejs"
NODE_INSTALLED=$(dpkg-query -W --showformat='${Status}\n' $NODE | grep "install ok installed")
echo "Checking for $NODE: $NODE_INSTALLED"
if [ "" == "$NODE_INSTALLED" ]; then
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  apt-get install -y build-essential nodejs
fi
cd /vagrant
npm run client-install
npm i
npm run start-all
