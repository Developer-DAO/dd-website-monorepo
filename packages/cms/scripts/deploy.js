// deploy to DO as part of CI
const axios = require('axios').default;
require('dotenv').config();

async function main() {
  try {
    const { data } = await axios.post(
      'https://api.digitalocean.com/v2/apps/21030157-a72b-40d2-afa6-0b498c63144d/deployments',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer dop_v1_e71d4dfae7bc57d9915a696ee55cbe2f7d8a428898c6484d0c9f16a0ba0b3cd2',
        },
      }
    );

    const deployId = data.deployment.id;

    console.log('\n');
    console.log('🚨🚨 CMS Deploy In Progress 🚨🚨');
    console.log('\n');

    const waitForDeploy = setInterval(async () => {
      const deployData = await axios(
        `https://api.digitalocean.com/v2/apps/21030157-a72b-40d2-afa6-0b498c63144d/deployments/${deployId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CMS_DEPLOY_KEY}`,
          },
        }
      );
      if (deployData.data.deployment.phase === 'ACTIVE') {
        clearInterval(waitForDeploy);
        console.log('CMS DEPLOY COMPLETE 🐐🎉🚀');
        console.log('\n');
      }
    }, 1500);
  } catch (error) {
    console.log(error.response.status);
    console.log('lol error');
  }
}

main()
  .then()
  .catch(() => process.exit(1));
