---
title: Nvidia ships an open Isaac GR00T reference humanoid for research labs
slug: nvidia-isaac-gr00t-open-reference-robot
authorId: chuck-steward
robotSlug: unitree-g1
summary: Jensen Huang unveiled a Jetson Thor reference rig built on Unitree H2 Plus hardware, aimed at universities rather than living rooms.
coverImage: /images/news/nvidia-isaac-gr00t-reference-robot.jpg
sourceUrl: https://nvidianews.nvidia.com/news/nvidia-open-humanoid-robot-reference-design
createdAt: 2026-06-12T14:00:00Z
updatedAt: 2026-06-12T14:00:00Z
---

At **GTC Taipei**, Nvidia CEO **Jensen Huang** rolled out the **Isaac GR00T Reference Humanoid Robot**: an open, research-focused stack that bundles hardware, simulation, data tools, and deployment software in one place. This is not a preorder page for your hallway. It is a lab kit meant to cut the glue work between custom mechanics, dataset capture, training, and on-robot inference.

## What Nvidia is shipping

- **Body:** **Unitree H2 Plus** humanoid base
- **Hands:** **Sharpa Wave** five-finger tactile grippers (22 DOF per hand)
- **Compute:** **Jetson AGX Thor T5000** (Blackwell GPU, **~2,070 FP4 TFLOPS**, 14-core Arm CPU, **128 GB** unified memory)
- **Software:** **Isaac GR00T** platform (Isaac Lab, Isaac Teleop, Omniverse/Cosmos synthetic data, Isaac ROS on Thor)
- **Availability:** reference design targets **October 2026** ship timing per Nvidia's announcement

## Spec snapshot

- **Size / weight:** about **180 cm** tall, **70 kg**
- **DOF:** **31** on the body plus **22** per hand (**75** total)
- **Vision:** stereo head camera (**140°** horizontal, **102°** vertical FOV), wrist cameras, IMU
- **Torque:** up to **120 N·m** on arms, **360 N·m** on legs
- **Payload:** **7 kg** nominal, **15 kg** peak
- **Power:** **15 Ah** pack rated **0.972 kWh**, roughly **3 hours** runtime cited
- **Connectivity:** Ethernet, **Wi-Fi 6**, Bluetooth 5.2, USB, onboard mics and speakers

Nvidia positions the stack as a way for universities and labs to skip rebuilding the same integration layer for every thesis project. Early adopters named in the release include **Ai2**, **ETH Zurich**, **Stanford Robotics Center**, and **UC San Diego's ARC Lab**.

## G1 angle for home robot watchers

The same **Isaac GR00T** developer platform is slated to add **Unitree G1** support later. That matters on HomeBotRadar because G1 is one of the few humanoids with a public spec sheet and real pre-order channels today. A shared Nvidia training and sim toolchain could speed up third-party skills on G1 even though this reference rig is built on the larger H2 Plus frame.

## What this means for HomeBotRadar

There is **no consumer price**, **no home MSRP**, and **no living-room ship date** in Nvidia's materials. Treat this as upstream R&D infrastructure, not a rival to Vector, Loona, or companion pets on our shelf.
