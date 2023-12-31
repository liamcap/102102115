import string
import time
import requests
import re
import jieba
from collections import Counter
import pandas as pd
from matplotlib import pyplot as plt
from wordcloud import WordCloud
import numpy
from PIL import Image

def count_and_write_to_excel(content_list, excel_file, stop_words):  # 统计词频并写入Excel文件
    top_twenty_words = []
    # 分词并去除空格、特殊字符和停用词
    words = [word.strip() for content in content_list for word in jieba.cut(content) if
             word.strip() and word not in stop_words and word.strip() not in string.punctuation]
    danmu_word_counts = Counter(words)  # 统计词频
    top_twenty_words = danmu_word_counts.most_common(20)
    df = pd.DataFrame(top_twenty_words, columns=["词汇", "频率"])  # 直接创建 DataFrame
    df = df.sort_values(by="频率", ascending=False)  # 根据频率降序排序
    df.to_excel(excel_file, index=False, engine='openpyxl')  # 写入Excel文件
    return top_twenty_words

def getdm(url, content_list):  # 从指定url获取弹幕存储在content_list
    headers = {  # 请求表头
        'user-agent': ''
    }
    response = requests.get(url=url, headers=headers)  # 发送请求
    response.encoding = 'utf-8'  # 解决乱码
    content = re.findall('<d p=".*?">(.*?)</d>', response.text)  # 正则表达式找出想要的内容
    for dms in content:
        content_list.append(dms)

def bvid2cid(bvid):  # 将BV号转化为cid
    url = f"https://api.bilibili.com/x/player/pagelist?bvid={bvid}&jsonp=jsonp"
    try:
        response = requests.get(url)
        response.raise_for_status()  # 检查请求是否成功
        data = response.json()
        if 'data' in data and data['data']:
            cid = data['data'][0]['cid']
            return cid
        else:
            print(f"未能找到视频的cid，可能是数据结构发生了变化：{data}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"请求B站API时出现错误：{e}")
        return None
    except (KeyError, IndexError) as e:
        print(f"提取cid时出现错误：{e}")
        return None

def get_bvs_and_cids(keyword, desired_count):
    headers = {
        'User-Agent': '',
        'Cookie': ''
    }

    current_count = 0  # 当前已获取的BV号数量
    bvs = []  # 存储所有获取的BV号
    cids = []  # 存储所有获取的BV号转换为cid
    page = 1  # 初始页码

    while current_count < desired_count:
        search_url = f'https://api.bilibili.com/x/web-interface/search/all?keyword={keyword}&page={page}&order='
        response = requests.get(search_url, headers=headers)
        data = response.text
        BVs = re.findall('BV..........', data)
        bvs.extend(BVs)
        current_count += len(BVs)
        page += 1
        if len(BVs) == 0:
            break
        print(search_url)
        time.sleep(1)

    print(f'获取到了 {len(bvs)} 个BV号：')

    for bvid in bvs:
        cid = bvid2cid(bvid)
        time.sleep(0.1)
        cids.append(cid)
        print(len(cids))
        if len(cids) == desired_count:
            break

    return cids

def main():
    content_list = []  # 存储获取到的弹幕

    with open('stopwords.txt', 'r', encoding='utf-8') as file:
        stop_words = set([line.strip() for line in file])

    keyword = '日本核污染水排海'  # 爬取视频弹幕的主题
    desired_count = 20  # 总共需要获取的BV号数量
    cids = get_bvs_and_cids(keyword, desired_count)

    for i in range(desired_count):
        oid = cids[i]
        url = 'https://api.bilibili.com/x/v1/dm/list.so?oid=' + str(oid)  # 弹幕网址
        getdm(url, content_list)
        print(i)  # 显示获取进度

    # 存储到excel文件
    excel_file = "danmu_word_counts.xlsx"
    top_twenty_words = count_and_write_to_excel(content_list, excel_file, stop_words)

    # 显示词云图
    color_mask = numpy.array(Image.open('whale.jpg'))  # 想要做成的形状
    wordcloud = WordCloud(mask=color_mask, font_path='simsun.ttc', background_color='white').generate_from_frequencies(
        dict(top_twenty_words))
    plt.figure(figsize=(8, 8))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.show()

if __name__ == "__main__":
    main()
