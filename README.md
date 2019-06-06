# ec2-instances-switcher

### 概要

- 指定された時間に、特定のタグが付与されたEC2インスタンスを起動する。
- 起動する時間は平日（月～金）の午前８時。
- デフォルトのリージョンは東京（ap-northeast-1）。

### 使い方

- 起動・停止対象のEC2インスタンスに `ec2-instances-switcher-isenabled` タグを付与。
- タグの値には `ON`, `TRUE`, `1` の何れかを設定。
- 起動・停止対象から外したい場合はタグを削除。またはタグの値に上記以外を設定。

### デプロイ

*serverless*

```sh
# stack-nameは環境に合わせて
uri=$(aws cloudformation describe-stacks \
          --stack-name public-holiday-api-dev \
          --query 'Stacks[].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue' \
          --output text)

(cd layer/nodejs; npm install)
sls deploy --public-holiday-api ${uri}
```

デプロイパラメータ

|パラメータ|概要|必須(初期値)|
|--|--|--|
|--public-holiday-api|[public-holiday-api](https://github.com/ot-nemoto/public-holiday-api) でdeployした祝日APIのURL|_true_|
