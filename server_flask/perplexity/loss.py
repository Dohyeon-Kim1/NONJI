import torch
import random

# bayesian personalized randking loss
def bpr_loss(emb, pos_emb, neg_emb, reg_lambda=1e-4):
    pos_score = torch.dot(emb, pos_emb)
    neg_score = torch.dot(emb, neg_emb)

    loss = -torch.log(torch.sigmoid(pos_score - neg_score) + 1e-8)
    reg_loss = (emb.norm(2).pow(2) + pos_emb.norm(2).pow(2) + neg_emb.norm(2).pow(2)) / 2
    return loss + reg_lambda * reg_loss


def neg_sampling(u, num_nodes, pos_edge_set):
    while True:
        neg = random.randint(0, num_nodes - 1)
        if (u, neg) not in pos_edge_set:
            return neg