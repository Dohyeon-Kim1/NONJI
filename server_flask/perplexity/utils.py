import random
import torch
import numpy as np


def set_seed(seed=0):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


def save_matrix(path, data: torch.Tensor):
    np.save(path, data.detach().cpu().float().numpy())
    print(f"saved {path}")


def cosine_sim(arr1, arr2):
    if len(arr1.shape) == 1:
        arr1 = arr1[None, :]
    if len(arr2.shape) == 1:
        arr2 = arr2[None, :]

    arr1 = arr1 / np.linalg.norm(arr1, ord=2, axis=1, keepdims=True)
    arr2 = arr2 / np.linalg.norm(arr2, ord=2, axis=1, keepdims=True)

    cos_sim = np.dot(arr1, arr2.T)
    return cos_sim