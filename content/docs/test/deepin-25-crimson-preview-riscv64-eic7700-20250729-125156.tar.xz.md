---
title: ESWIN EIC7700 20250729 镜像测试报告
date: 2025-11-13
author: Alex Rain
---

## 下载镜像

通过[链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250729/riscv64/deepin-25-crimson-preview-riscv64-eic7700-20250729-125156.tar.xz)下载镜像压缩包，随后使用以下命令解压镜像与校验码至当前文件夹：

```shell
tar xf deepin-25-crimson-preview-riscv64-eic7700-20250627-155140.tar.xz
```

校验镜像：

```shell
# 三者对应即可
$ sha256sum -c deepin-eic7700-riscv64-25-desktop-installer.sha256sum
deepin-eic7700-riscv64-25-desktop-installer.boot.ext4: OK
deepin-eic7700-riscv64-25-desktop-installer.root.ext4: OK
# 也可以使用 .md5sum, 留给读者完成
```

## 测试设备：Pine64 StarPro64

[参考文档](https://pine64.org/documentation/StarPro64/_full/)

### 硬件准备

- Pine64 StarPro64
- 12V DC 电源适配器
- USB A to A 数据线
- HDMI 显示器
- 键盘、鼠标
- USB-TTL 串口适配器

### 刷写操作系统

#### 刷写操作系统至 eMMC

到手的板子可能开机一次便无法再开机。参考这里的步骤更新 bootloader: https://github.com/ruyisdk/support-matrix/pull/318#issuecomment-2955040832

（该操作在 https://pine64.org/documentation/StarPro64/_full/#sdks 中的 `docs.7z` 包含的 `EIC7700_开发评估板-A2用户手册_CN_v0.6.pdf` 中的 "4.安装 BOOTLOADER 镜像" 小节亦有记载。
在 [eic7700x datasheet](https://pine64.org/documentation/StarPro64/_full/#datasheets-for-components-and-peripherals) 中及采用了相同 SoC 的 P550 开发板的[手册](https://sifive.cdn.prismic.io/sifive/Z1h2tZbqstJ98Rbb_HF106_user_guide_V1p2_zh.pdf) 中也描述了开机拨码开关的含义。


首先从 https://github.com/deepin-community/deepin-ports-kernel actions 中下载最新的 bootloader (一般来说 `build all` task 是最新的), 即名为 `uboot-eic770x-rockos` 的 artifact.

提取 `/pine64-starpro64/bootloader_secboot_ddr5.bin` 备用。

将拨码开关拨至 `0011`, 使用 usb A to A 线将电脑与开发板蓝色的靠近主板的 usb 口连接，并连接串口。
<img width="1280" height="1280" alt="image" src="https://github.com/user-attachments/assets/93598e2c-db4e-4024-81b5-b478fe1d3364" />

给主板上电，可得一个 label 应为 `eswin-2030` 的 **新** 盘。将上一步提取的 `bootloader_secboot_ddr5.bin`
复制进去。

此时应可观测到散热风扇开始啸叫。几秒后 ddr 自检完成，板子开始引导复制进去的文件，在串口上应当能观测到 u-boot. 按照提示按任意按键打断启动流程进入 u-boot shell.

有以下几种方式加载引导文件：
- `loady` 或 `loadb` 通过串口传输。
- 通过 TFTP 传输
- 通过 sd 卡传输

对于通过 sd 卡传输，将文件放在 sd 卡根目录并将文件名截短再通过 `load mmc 1 <addr> boot.bin` 应当可以轻易实现。
对于通过 TFTP 传输，请参考 https://docs.rockos.dev/docs/installation/#%E5%88%B7%E5%86%99%E9%95%9C%E5%83%8F-1
本部分将介绍通过串口传输：在终端内运行 `loady`，uboot 将会把接收到的文件存放在 `0x80200000` 开始的地址。
使用喜欢的串口客户端来进行 YMODEM 文件传输（可以使用 `minicom`），按照串口速率大概需要传输 5 分钟才能完成。
完成后，运行：
`es_burn write 0x80200000 flash`
完成后，将拨码开关拨回 `1011`, 
<img width="1280" height="987" alt="image" src="https://github.com/user-attachments/assets/58a9c034-48e3-40b8-9580-151c2b26168b" />

运行 `reset`.
后面的步骤请参考上面的链接。

deepin u-boot 无法通过 fastboot 来更新分区，故需要通过其他方法更新 eMMC 中的系统。StarPro64 的 eMMC 芯片可以取下，也可以通过加载 sd 卡中的系统然后在系统内写入分区。

参考输入：

```
dd if=deepin-eic7700-riscv64-25-desktop-installer.boot.ext4 of=/dev/mmcblk1p1 bs=4M status=progress
dd if=deepin-eic7700-riscv64-25-desktop-installer.root.ext4 of=/dev/mmcblk1p2 bs=4M status=progress
```

### 启动测试

1. 将板子通电
2. 观察到 bootloader正常加载，成功找到操作系统并进行引导
3. 观察到 initrd 与内核正确启动，正常进入 systemd ， Plymouth 正常展示
4. HDMI 显示器显示安装器界面
5. 通过USB接入鼠标键盘，正常工作。
6. 完成图形化安装引导，进入桌面环境

### 桌面环境测试 TODO


- 观察到显示器输出正常，安装器界面、登录界面与 DDE 桌面环境皆正常显示。 TTY 切换功能正常工作。
- 观察到DDE桌面、任务栏与弹出菜单皆正常渲染，动画正常显示。鼠标正常渲染，按键无卡顿。
- `glxgears` 、 `es2gears_x11` 、`vkgears` 皆正常进行图形渲染，`glmark2` 分数：28，`glmark2-es2` 分数：1101，测试通过。
- 控制中心、文件管理器、文本编辑器等系统内置应用皆正常工作
- `mpv` 与系统默认播放器在播放视频时正常工作，浏览器视频播放正常工作
- Firefox 浏览器和 LibreOffice 办公套件可以正常工作。`build-essential` 套件可以正常安装并工作。
- 板载网卡可以正常工作。

### 异常记录

- 由手机模拟的鼠标无法输入按键事件。
- `glxinfo` 和 `vkgears -info` 输出中显示 `llvmpipe`。 可安装 `pvr-vulkan-drivers` 包来安装 vulkan 驱动。
- 无线网卡和蓝牙无法工作。
- sd 无法热插拔。

### 结论

该镜像在 Pine64 StarPro64 上通过测试。
