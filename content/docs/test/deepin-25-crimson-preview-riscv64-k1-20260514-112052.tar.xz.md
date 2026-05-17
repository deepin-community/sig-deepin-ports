---
title: SpacemiT K1 20260514 镜像测试报告
date: 2026-05-17
author: karanocave
---

## 下载镜像

通过镜像发布页下载 `deepin-25-crimson-preview-riscv64-k1-20260514-112052.tar.xz`，随后解压得到系统镜像与校验文件：

```bash
tar -xvf deepin-25-crimson-preview-riscv64-k1-20260514-112052.tar.xz
```

校验镜像：

```bash
$ cat deepin-k1-riscv64-25-desktop-installer.md5sum
cdbb7f5e93d36aecea9cb8f6230846da  deepin-k1-riscv64-25-desktop-installer.boot.ext4
dd80d30afe3a2b85043086128df47d6d  deepin-k1-riscv64-25-desktop-installer.root.ext4

$ md5sum deepin-k1-riscv64-25-desktop-installer.boot.ext4
cdbb7f5e93d36aecea9cb8f6230846da  deepin-k1-riscv64-25-desktop-installer.boot.ext4

$ md5sum deepin-k1-riscv64-25-desktop-installer.root.ext4
dd80d30afe3a2b85043086128df47d6d  deepin-k1-riscv64-25-desktop-installer.root.ext4

$ cat deepin-k1-riscv64-25-desktop-installer.sha256sum
b92f3d79cd97d831fdf70ebdfef4485b3d50589795555fd756866136ca411cfd  deepin-k1-riscv64-25-desktop-installer.boot.ext4
0d499915f9da69c89ac0aac8eab78178704730671bb7d6e59954fe09bd49a2cd  deepin-k1-riscv64-25-desktop-installer.root.ext4
```

### 测试设备：SpacemiT MUSE Pi Pro

### 硬件准备

- SpacemiT MUSE Pi Pro
- 电源适配器
- USB 转 TTL 调试线
- MicroSD 卡
- USB 读卡器
- HDMI 显示器

### 连接串口

使用 USB 转 TTL 调试线连接设备与电脑，波特率为 `115200`。本次测试的完整串口日志保存在：

`/Users/karanocave/serial-2026-05-17-185203.log`

### 刷写 bootloader

本次测试遵循 `sig-deepin-ports/content/docs/install/k1.md`。

Bootloader 使用 deepin-ports-kernel GitHub Actions 产物：

- `https://github.com/deepin-community/deepin-ports-kernel/actions/runs/25951392567`

根据 K1 安装文档与实际启动行为，SD 卡启动介质最终写入为以下布局：

- `bootinfo_sd.bin` 写入首扇区前 80 字节
- `FSBL.bin` 写入 `128K`
- `u-boot-env-default.bin` 写入 `384K`
- `fw_dynamic.itb` 作为 `opensbi` 分区写入 `1M`
- `u-boot.itb` 作为 `uboot` 分区写入 `2M`
- `deepin-k1-riscv64-25-desktop-installer.boot.ext4` 写入 `bootfs` 分区，起始于 `4M`
- `deepin-k1-riscv64-25-desktop-installer.root.ext4` 写入 `rootfs` 分区，起始于 `260M`

实际生成的 GPT 分区如下：

- `fsbl`
- `env`
- `opensbi`
- `uboot`
- `bootfs`
- `rootfs`

### 刷写操作系统至 SD 卡

按照 `sig-deepin-ports/content/docs/install/k1.md` 的分区定义，将系统镜像直接写入 SD 卡。写入过程无 I/O 报错，写入后主机可识别出上述 6 个 GPT 分区。

### 启动测试

1. 将 SD 卡插入板卡，接入串口与电源。
2. 上电后观察到设备从 SD 卡启动，SPL 能够成功加载 `opensbi` 与 `uboot`：

```text
sys: 0x200
try sd...
bm:3
j...

U-Boot SPL 2022.10spacemit-gb26ef870-dirty (May 16 2026 - 03:18:15 +0000)
[   0.644] Boot from fit configuration k1-x_MUSE-Pi-Pro
[   0.646] ## Checking hash(es) for config conf_17 ... OK
[   0.651] ## Checking hash(es) for Image uboot ... crc32+ OK
[   0.662] ## Checking hash(es) for Image fdt_17 ... crc32+ OK
[   0.710] ## Checking hash(es) for config config_1 ... OK
[   0.713] ## Checking hash(es) for Image opensbi ... crc32+ OK
```

3. 进入 U-Boot 后，能够从 `bootfs` 成功读取 `env_k1-x.txt`：

```text
[   1.890] 228 bytes read in 7 ms (31.3 KiB/s)
[   1.891] ## Info: input data size = 229 = 0xE5
[   1.895] load env_k1-x.txt from bootfs successful
```

4. 自动引导阶段失败。U-Boot 试图从 `bootfs` 加载内核、设备树与 initramfs，但未找到对应文件：

```text
[   1.921] Try to boot from mmc0 ...
[   2.026] product_name: k1-x_MUSE-Pi-Pro
[   2.027] match dtb by product_name: /k1-x_MUSE-Pi-Pro.dtb
[   2.032] select /k1-x_MUSE-Pi-Pro.dtb to load
[   2.036] Loading kernel...
[   2.067] Failed to load 'Image.itb'
[   2.067] Loading dtb...
[   2.092] Failed to load '/k1-x_MUSE-Pi-Pro.dtb'
[   2.093] load dtb from bootfs fail, use built-in dtb
[   2.098] Loading ramdisk ...
[   2.129] Failed to load 'initramfs-generic.img'
[   2.130] load ramdisk from bootfs fail, use built-in ramdisk
No FDT memory address configured. Please configure
the FDT address via "fdt addr <address>" command.
Aborting!
Bad Linux RISCV Image magic!
[   2.148] ########### boot failed by default config, check your boot config #############
```

5. 测试在 bootloader 阶段终止，未进入内核启动阶段。

### 未通过的最高条件

未通过的最高条件为 `3.1 bootloader 启动` 中的：

- 串口控制台 **不应该 (SHOULD NOT)** 在 bootloader 阶段输出致命性的错误日志。

实际观测中，虽然 SPL 与 U-Boot 本身已成功启动，但 U-Boot 在默认引导流程中无法从 `bootfs` 加载：

- `Image.itb`
- `/k1-x_MUSE-Pi-Pro.dtb`
- `initramfs-generic.img`

因此自动引导终止于 bootloader 阶段，无法进入 `3.2 内核启动`。

### 异常记录

- `Failed to get fastboot key config: -19`
- `Failed to probe HUSB239: -19`

以上日志未阻止 U-Boot 启动，不是本次测试终止的直接原因。

此外，对 `deepin-k1-riscv64-25-desktop-installer.boot.ext4` 内容进行检查后发现，该 `bootfs` 镜像内包含：

- `env_k1-x.txt`
- `bianbu.bmp`
- `grub/...`

但未发现本次 U-Boot 默认启动流程所需的以下文件：

- `Image.itb`
- `initramfs-generic.img`
- `k1-x_MUSE-Pi-Pro.dtb`

### 附加排障记录：手工修补 SD 卡后的二次启动结果

为确认问题边界，本次测试额外对 SD 卡内容进行了手工修补：

- 保持前述 `bootinfo`、`FSBL`、`OpenSBI`、`U-Boot` 与 GPT 分区布局不变
- 重建 `bootfs`，补入：
  - `vmlinuz-6.6.63-k1-spacemit-66y`
  - `spacemit/6.6.63-k1-spacemit-66y/k1-x_MUSE-Pi-Pro.dtb`
  - 指向上述文件的 `env_k1-x.txt`
- 向 `rootfs` 补入 `/usr/lib/modules/6.6.63-k1-spacemit-66y`

修补后的完整串口日志保存在：

`/Users/karanocave/serial-2026-05-17-201601.log`

修补后，U-Boot 已能够从 `bootfs` 成功加载内核和 DTB，并开始启动 Linux 内核：

```text
[   1.917] load env_k1-x.txt from bootfs successful
[   2.045] match dtb by product_name: spacemit/6.6.63-k1-spacemit-66y/k1-x_MUSE-Pi-Pro.dtb
[   2.060] Loading kernel...
[   2.613] 36731392 bytes read in 511 ms (68.6 MiB/s)
[   2.615] Loading dtb...
[   2.656] 87773 bytes read in 19 ms (4.4 MiB/s)
Starting kernel ...
[    0.000000] Linux version 6.6.63-k1-spacemit-66y ...
```

这说明前述原始镜像中的首要问题确实位于 `bootfs` 内容不完整，而不是 SD 启动布局本身。

但修补后系统仍未完成启动，新的失败点已经前移到内核早期初始化阶段。串口日志显示：

- 仍未找到 `initrd.img-6.6.63-k1-spacemit-66y`
- `spacemit-rproc` 反复因 `esos.elf` 缺失而启动失败
- 随后出现多次 `kernfs` warning 与 `refcount_t: underflow; use-after-free`
- 最终出现 `rcu_preempt detected stalls on CPUs/tasks`
- 日志中未出现 `systemd[1]`、登录提示符或图形界面启动信息

关键日志片段：

```text
[   2.683] Failed to load 'initrd.img-6.6.63-k1-spacemit-66y'
[   2.685] load ramdisk from bootfs fail, use built-in ramdisk
[    2.816148] remoteproc remoteproc0: Direct firmware load for esos.elf failed with error -2
[    2.869792] spacemit-rproc c088c000.rcpu_rproc: rproc_boot failed
[    3.275981] refcount_t: underflow; use-after-free.
[   25.042161] rcu: INFO: rcu_preempt detected stalls on CPUs/tasks:
```

因此，手工修补 `bootfs/rootfs` 后虽然已经能够进入 `3.2 内核启动`，但仍未完成 `3.4 systemd 启动`，不能视为原始镜像测试通过。

### 结论

**支持等级：1 仅可安装，无法启动**

该镜像在 SpacemiT MUSE Pi Pro 上未通过测试。

> 本次测试确认：原始镜像的首要失败点位于 `bootfs` 内容与 U-Boot 默认引导约定不匹配，导致系统停在 bootloader 阶段。进一步手工修补后，设备已经能够进入 Linux 内核，但仍会在内核早期阶段因 `spacemit-rproc` / `esos.elf` 缺失、`refcount` 异常和 RCU stall 而无法继续启动至 `systemd`。因此原始发布镜像仍应判定为未通过测试。
