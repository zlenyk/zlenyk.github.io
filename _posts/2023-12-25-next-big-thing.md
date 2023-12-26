---
layout: post
title:  "What is the next 'Big Thing' in Computer Vision"
date:   2023-12-24
category: AI esseys
---
Convolutions vs Transformers. Large-scale-pretraining vs self-supervised training vs foundation models.
In the last 10 years we made a leap in computer vision. We basically solved classification. We are close to having perfect dense prediction tasks (2d detection, 2d segmentation). We are making reasonable progress in 3d object detection and segmentation from point clouds.

What will computer vision look like in 2030? Are there papers that are not getting enough attention (no pun intended) but are actually the future of CV, even if something is holding back their results?
What will be the dominant architecture and dominant training style?

To start making such predictions, first we need to answer: **what will be the problem that vision will be solving in 2030?**  
I am going to argue that answer to that is quite vague and actually is **scene understanding**. Given perception input (image, point-cloud, etc.), generate features that are descriptive enough that can answer multiple questions:
- what is on the image (bounding boxes and classes)?
- what is likely to happen next?
- is this 

Emergence of foundation models created a new way of thinking about design of ML systems: one model that is pretrained on large dataset and some well-designed task (sometimes multiple of tasks) and than either fine-tuning, distilling or creating task-specific head on top.

The real question: what will be the problem that vision will be solving in 2030? Classification, detection, segmentation, or general "understanding"?