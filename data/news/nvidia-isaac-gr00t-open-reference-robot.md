---
title: Nvidia ships an open Isaac GR00T reference humanoid for research labs
slug: nvidia-isaac-gr00t-open-reference-robot
authorId: chuck-steward
robotSlug: unitree-g1
summary: "Jensen Huang unveiled a Jetson Thor reference rig built on Unitree H2 Plus hardware, aimed at universities rather than living rooms. On July 6, Nvidia published the Unitree G1 workflow that note had left open."
coverImage: /images/news/nvidia-isaac-gr00t-reference-robot.jpg
sourceUrl: https://nvidianews.nvidia.com/news/nvidia-open-humanoid-robot-reference-design
createdAt: 2026-06-12T14:00:00Z
updatedAt: 2026-11-03T21:05:00Z
---

At **GTC Taipei**, Nvidia CEO **Jensen Huang** rolled out the **Isaac GR00T Reference Humanoid Robot**: an open, research-focused stack that bundles hardware, simulation, data tools, and deployment software in one place. This is not a preorder page for your hallway. It is a lab kit meant to cut the glue work between custom mechanics, dataset capture, training, and on-robot inference.

## What Nvidia is shipping

- **Body:** **Unitree H2 Plus** humanoid base
- **Hands:** **Sharpa Wave** five-finger tactile grippers (22 DOF per hand)
- **Compute:** **Jetson AGX Thor T5000** (Blackwell GPU, **~2,070 FP4 TFLOPS**, 14-core Arm CPU, **128 GB** unified memory)
- **Software:** **Isaac GR00T** platform (Isaac Lab, Isaac Teleop, Omniverse/Cosmos synthetic data, Isaac ROS on Thor)
- **Availability:** Nvidia says Unitree will offer the reference design in **late 2026**. The announcement does not name October, and the page has not been updated to say units have shipped.

## Spec snapshot

- **Size / weight:** about **180 cm** tall, **70 kg**
- **DOF:** **31** on the body plus **22** per hand (**75** total)
- **Vision:** stereo head camera (**140°** horizontal, **102°** vertical FOV), wrist cameras, IMU
- **Torque:** up to **120 N·m** on arms, **360 N·m** on legs
- **Payload:** **7 kg** nominal, **15 kg** peak
- **Power:** **15 Ah** pack rated **0.972 kWh**, roughly **3 hours** runtime cited
- **Connectivity:** Ethernet, **Wi-Fi 6**, Bluetooth 5.2, USB, onboard mics and speakers

Nvidia positions the stack as a way for universities and labs to skip rebuilding the same integration layer for every thesis project. Early adopters named in the release include **Ai2**, **ETH Zurich**, **Stanford Robotics Center**, and **UC San Diego's ARC Lab**.

## G1 workflow is out

The May 31 announcement said a **Unitree G1** workflow would show up soon. [Isaac ROS 4.5](https://nvidia-isaac-ros.github.io/v/release-4.6/releases/index.html), released July 6, 2026, added that path: record demonstrations on a G1, then deploy a GR00T policy on the real robot. The same notes cover teleoperation in simulation and on the hardware. Unitree G1 is the humanoid HomeBotRadar already tracks. This is a lab toolchain for that robot, not a new living-room model, and the reference rig in this story is still the larger H2 Plus.

## What this means for HomeBotRadar

There is **no consumer price**, **no home MSRP**, and **no living-room ship date** in Nvidia's materials. Treat this as upstream R&D infrastructure, not a rival to Vector, Loona, or companion pets on our shelf.
