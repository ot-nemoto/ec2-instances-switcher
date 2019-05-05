# ec2-instances-switcher

### 概要

- 指定された時間に、特定のタグが付与されたEC2インスタンスを起動する。
- 起動する時間は平日（月～金）の午前８時。
- デフォルトのリージョンは東京（ap-northeast-1）。

### 使い方

- 起動・停止対象のEC2インスタンスに `ec2-instances-switcher-isenabled` タグを付与。
- タグの値には `ON`, `TRUE`, `1` の何れかを設定。
- 起動・停止対象から外したい場合はタグを削除。またはタグの値に上記以外を設定。
- デプロイ

*serverless*
```sh
(cd layer/nodejs; npm install)
sls deploy --public_holiday_api ${uri}/holiday
```

※ ${uri} は [public-holiday-api](https://github.com/ot-nemoto/public-holiday-api) でdeployした祝日APIを参照

---

*aws sam*
```sh
BUCKET_NAME=ec2-instances-switcher-`date +%Y%m%d%H%M%S`
aws s3 mb s3://${BUCKET_NAME}
sam package --s3-bucket ${BUCKET_NAME} --output-template-file packaged-template.yml
sam deploy --template-file packaged-template.yml --stack-name ec2-instances-switcher --capabilities CAPABILITY_IAM
```

※ samのdeploy手順はメンテしないないので非推奨
