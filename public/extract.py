import cv2
vidcap = cv2.VideoCapture('bg-video.mp4')
success, image = vidcap.read()
count = 1
fps = vidcap.get(cv2.CAP_PROP_FPS)
if not fps: fps = 30
frame_skip = int(fps/15) if fps > 15 else 1
frame_count = 0
while success:
    if frame_count % frame_skip == 0:
        height, width = image.shape[:2]
        if height > 1080:
            scale = 1080 / height
            image = cv2.resize(image, (int(width * scale), 1080))
        cv2.imwrite(f'frames/frame_{count:04d}.jpg', image, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        count += 1
    success, image = vidcap.read()
    frame_count += 1
