import React, { useState, useRef } from "react";
import { Tabs, Flex, Box, TextArea, Button, Select, Text } from "@radix-ui/themes";
import { createItem, getVideo } from './api/ai';
import { useImageStore } from './store';

const Left = () => {

  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [selRatio, setSelRatio] = useState("1:1");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    images,
    setImages,
    videos,
    setVideos,
    generationType,
    setGenerationType,
    inputImage,
    setInputImage
  } = useImageStore();

  const handleGenerate = async () => {
    // alert("图片生成中...（伪功能）" + prompt);
    setLoading(true);
    const res = await createItem({ prompt, ratio: selRatio });
    console.log(res);
    if (res) {
      setImages([...images, res.data.image_urls[0]]);
    }
    setLoading(false);
  };

  const handleTabChange = (value: string) => {
    setGenerationType(value);
    console.log("当前生成类型是:", value);
  };

  const fileButtonClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      setInputImage(reader.result as string); // Base64 图片地址
    };
    reader.readAsDataURL(file); // 读取为 Base64
  };

  const genVideo = async () => {
    setLoading(true);

    const file = fileRef.current?.files?.[0];

    const formData = new FormData();
    if (!file) {
      formData.append("imageUrl", inputImage);
    } else {
      formData.append("file", file);
    }

    formData.append("prompt", prompt2);
    formData.append("ratio", selRatio);

    const res2 = await fetch("/api/createVideo", {
      method: "POST",
      body: formData,
    });

    const res = await res2.json();

    console.log(res);
    if (!res) {
      setLoading(false);
      return;
    }

    if (res.code != 10000) {
      setLoading(false);
      return;
    }
    
    const task_id = res.data.task_id;

    const timeId = setInterval(async () => {
      const res = await getVideo({task_id});
      console.log(res);
      if (res && res.code == 10000 && res.data.video_url) {
        setVideos([...videos, res.data.video_url]);
        clearInterval(timeId);
        setLoading(false);
      }
    }, 20000);

  };

  let content = <></>;

  if (generationType === "image") {
    content = <>
      <Box my="5">
        <Text as="label" size="2" weight="bold">描述想要生成的图片</Text>
        <Flex gap="3">
          <Box width="100%">
            <TextArea className="h-[100px]" size="2" placeholder="描述想要生成的图片" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </Box>
        </Flex>

        <Text size="1" color="gray">{prompt.length}/800</Text>
      </Box>

      <Flex gap="5" direction={{ initial: "column", sm: "row" }}>
        <Box>
          <Text as="label" size="2" weight="bold">比例</Text>
          <Flex wrap="wrap" gap="2" mt="2">
            {["21:9", "16:9", "3:2", "4:3", "1:1", "3:4", "2:3", "9:16", "9:21"].map(ratio => (
              <Button key={ratio} variant={ratio === selRatio ? "solid" : "outline"}
                onClick={() => {
                  setSelRatio(ratio);
                }}>
                {ratio}
              </Button>
            ))}
          </Flex>
        </Box>
      </Flex>

      <Button size="3" mt="5" style={{ width: "100%" }} loading={loading} onClick={() => handleGenerate()}>开始生成</Button>
    </>;
  } else if (generationType === "video") {
    content = <>
      <Box my="5">
        <Flex gap="3" direction="column">
          <Box width="100%">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {!inputImage && (
              <img src="/vite.svg" alt="Preview" className="w-auto h-20 rounded" onClick={fileButtonClick} />
            )}
            {inputImage && (
              <img src={inputImage} alt="Preview" className="w-auto h-20 rounded" onClick={fileButtonClick} />
            )}
          </Box>
          <Box width="100%">
            <TextArea className="h-[100px]" size="2" placeholder="结合图片，描述你想生成的画面和动作。
例如：海浪拍打着沙滩，粉色的月亮在天空中缓缓升起。" value={prompt2} onChange={(e) => setPrompt2(e.target.value)} />
          </Box>
        </Flex>
      </Box>

      <Text as="label" size="2" weight="bold">生成视频时长</Text>
      <Flex gap="3" className="mb-5">
        <Box width="100%">
          <Select.Root size="2" defaultValue="5">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="5">5秒</Select.Item>
              <Select.Item value="10">10秒</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      </Flex>

      <Flex gap="5" direction={{ initial: "column", sm: "row" }}>
        <Box>
          <Text as="label" size="2" weight="bold">比例</Text>
          <Flex wrap="wrap" gap="2" mt="2">
            {["21:9", "16:9", "3:2", "4:3", "1:1", "3:4", "2:3", "9:16", "9:21"].map(ratio => (
              <Button key={ratio} variant={ratio === selRatio ? "solid" : "outline"}
                onClick={() => {
                  setSelRatio(ratio);
                }}>
                {ratio}
              </Button>
            ))}
          </Flex>
        </Box>
      </Flex>

      <Button size="3" mt="5" style={{ width: "100%" }} loading={loading} onClick={() => genVideo()}>开始生成</Button>
    </>;
  }

  return (
    <Box p="5" width="100%" mx="auto">
      {/* 1. 顶部标签页 */}
      <Tabs.Root value={generationType} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="image">图片生成</Tabs.Trigger>
          <Tabs.Trigger value="video">视频生成</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {content}

    </Box>
  );
}

export default Left;