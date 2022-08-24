import React, {useState} from 'react';
import {Button, Card, Cascader, Form, Input, message, Upload} from "antd";
import {getCourseClassifyList} from "@/services/ant-design-pro/course";
import type {UploadChangeParam} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import type {RcFile, UploadProps} from 'antd/es/upload/interface';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import {PageContainer} from "@ant-design/pro-components";
import {getUploadInfo} from '@/services/ant-design-pro/api'
import type {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import { request } from '@umijs/max';

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const optionsList: Option[] = [
  {value: "123", label: "123", children: []}
];
getCourseClassifyList().then(res => {
  for (const resKey in res) {
    const optionInfo: Option = {
      label: res[resKey].name,
      value: res[resKey].id,
    }
    if (res[resKey].subclass !== []) {
      optionInfo.children = getCourseList(res[resKey].subclass)
    }
    optionsList.push(optionInfo)
  }
})

function getCourseList(list: APICourse.CourseClassify) {
  let children: Option[] = [];
  const option: Option[] = [];
  for (const courseClassifyKey in list) {
    if (list[courseClassifyKey].subclass) {
      children = getCourseList(list[courseClassifyKey].subclass)
    }
    if(children == []){
      option.push({
        label: list[courseClassifyKey].name,
        value: list[courseClassifyKey].id
      })
    }else{

      option.push({
        label: list[courseClassifyKey].name,
        value: list[courseClassifyKey].id,
        children: children
      })
    }
  }
  return option
}

const Edit: React.FC = () => {
  const [optionsCascader] = useState<Option[]>(optionsList);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageId, setImageId] = useState<string>();
  const [fileId, setFileId] = useState<string>();
  const [coverUrl, setCoverUrl] = useState<string>();
  const [coverId, setCoverId] = useState<string>();
  const [uploadAction, setUploadAction] = useState<string>("");
  const [uploadHeader, setUploadHeader] = useState<UploadProps['headers']>({});
  console.log("optionsCascader", optionsCascader)

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false);
      setImageUrl(uploadAction);
    }
  };
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    setUploadHeader({
      "Content-Type": file.type
    })
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    const uploadBody: API.UploadInfoBody = {
      extra: "",
      filename: file.name,
      hash: [
        file.uid
      ],
      mime_type: file.type,
      parts: 1,
      size: file.size.toString(),
      type: "image"
    }
    console.log(uploadBody)
    return getUploadInfo(uploadBody).then(r => {
      const uploadOneInfo = r.url[0]
      const uploadUrl = uploadOneInfo.Scheme + "://" + uploadOneInfo.Host + uploadOneInfo.Path
      console.log("uploadUrl", uploadUrl)
      setFileId(r.file_id)
      setUploadAction(uploadUrl)
      console.log("file_id", fileId)
    });
    // return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );
  const uploadCoverButton = (
    <div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );
  const customRequest = (fileOptions: RcCustomRequestOptions) => {
    setLoading(true);
    console.log("fileOptions", fileOptions)
    request(fileOptions.action, {
      method: fileOptions.method,
      headers: fileOptions.headers,
      data: fileOptions.file
    }).then(res => {
      console.log(res)
      setLoading(false);
      console.log("upfileId", fileId)
      if (fileOptions.filename == 'cover'){
        setCoverUrl(uploadAction);
        setCoverId(fileId)
      }else{
        setImageUrl(uploadAction);
        setImageId(fileId)
      }
    });
  }
  const onFinish = (values: any) => {
    console.log("coverId", coverId)
    values.cover = coverId;
    values.provider_avatar = imageId;
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onChangeCascader= (value: string[]) => {
    console.log(value);
    console.log(optionsCascader)
  };
  return (
    <PageContainer
      header={{
        ghost: false
      }}
    >
      <Card bordered={false} style={{marginTop: 20}}>
          <Form
            labelCol={{span: 4}}
            wrapperCol={{span: 14}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              wrapperCol={{span: 12}}
              label={'类型'}
              name={'course_classify_id'}
              required={true}
            >
              <Cascader
                options={optionsCascader}
                placeholder="请选择类型"
                onChange={onChangeCascader}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{span: 12}}
              label={'标题'}
              name={'title'}
              required={true}
            >
              <Input
                name={'title'}
                placeholder={'请填写标题'}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{span: 12}}
              label={'封面'}
              required={true}
            >
              <Upload
                name="cover"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                method={'PUT'}
                action={uploadAction}
                headers={uploadHeader}
                customRequest={customRequest}
              >
                {coverUrl ? <img src={coverUrl} alt="avatar" style={{width: '100%'}}/> : uploadCoverButton}
              </Upload>
            </Form.Item>

            <Form.Item
              hidden={true}
              name={"cover"}
            />
            <Form.Item
              wrapperCol={{span: 12}}
              label={'作者名称'}
              name={'author_name'}
              required={true}
            >
              <Input name={'author_name'}/>
            </Form.Item>
            <Form.Item
              wrapperCol={{span: 12}}
              label={'提供者名称'}
              name={'provider'}
              required={true}
            >
              <Input name={'provider'}/>
            </Form.Item>
            <Form.Item
              wrapperCol={{span: 12}}
              label={'提供者头像'}
              required={true}
            >
              <Upload
                name="provider_avatar"
                listType="picture-card"
                className="provider_avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                method={'PUT'}
                action={uploadAction}
                headers={uploadHeader}
                customRequest={customRequest}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
              </Upload>
            </Form.Item>

            <Form.Item
              hidden={true}
              name={"provider_avatar"}
            />
            <Form.Item
              wrapperCol={{span: 12}}
              label={'描述'}
              name={'introduction'}
              required={true}
            >
              <TextArea name={'introduction'} rows={4} placeholder="填写描述" maxLength={6}/>
            </Form.Item>
            <Form.Item
              wrapperCol={{offset: 14}}
            >
              <Button type={'primary'} htmlType="submit">提交</Button>
            </Form.Item>
          </Form>
      </Card>
    </PageContainer>
  )
}

export default Edit
