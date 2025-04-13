import argparse
import json
import torch
import numpy as np
import os

from .data import PaperGraph
from .model import LightGCN
from .loss import bpr_loss, neg_sampling
from .utils import set_seed, save_matrix, cosine_sim
from .api import text_embed

curr_dir = os.path.dirname(os.path.abspath(__file__))

def parse_args():
    parser = argparse.ArgumentParser(description="NonJi Project")
    parser.add_argument("--mode", type=str, choices=["train_lightgcn", "recommend"])
    parser.add_argument("--seed", type=int, default=0)

    # train lightgcn mode
    parser.add_argument("--data_path", type=str, default="data/dummy/paper.json")
    parser.add_argument("--data_mode", type=str, default="citing", choices=["citing", "cited"])
    parser.add_argument("--num_layers", type=int, default=4)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--num_epochs", type=int, default=100)

    # recommned mode
    parser.add_argument("--topk", type=int, default=10)
    parser.add_argument("--paper", type=str, default="Diffusion-Based Neural Network Weights Generation")

    args = parser.parse_args()
    return args


def train_lightgcn(model, dataset, optimizer, lr_scheduler, args):
    num_nodes = model.num_nodes
    pos_edge_set = set(map(tuple, dataset.edges.T.tolist()))

    model.train()
    for epoch in range(args.num_epochs):
        final_emb = model()
        
        losses = []
        for (u, v) in pos_edge_set:
            u_emb = final_emb[u]
            pos_emb = final_emb[v]
            neg = neg_sampling(u, num_nodes, pos_edge_set)
            neg_emb = final_emb[neg]
            
            loss = bpr_loss(u_emb, pos_emb, neg_emb)
            losses.append(loss)
        loss = torch.stack(losses).mean()

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        lr_scheduler.step()
        
        print(f"Epoch {epoch+1:03d}, Loss: {loss.item():.4f}")
    
    print("Training finished!")
    save_matrix(f"data/graph/{args.data_mode}_trained_embeds.npy", model.embeds.data)


def recommend_papers(info):
    paper_embeds = np.load(os.path.join(curr_dir, "data/graph/citing_trained_embeds.npy"))
    with open(os.path.join(curr_dir, "data/dummy/paper.json")) as f:
        papers = json.load(f)

    text = info["text"]
    emb = text_embed(text)
    
    cos_sim = cosine_sim(emb, paper_embeds)[0]
    sorted_idxs = np.argsort(cos_sim)[::-1]
    sorted_papers = [papers[idx] for idx in sorted_idxs]
    return sorted_papers


def recommend_people(info):
    hashtag = ", ".join(info["hashtag"])
    paper_ids = info["paper_ids"]

    print("paper_ids", paper_ids)

    if not hashtag and len(paper_ids) == 0:
        return None
    
    paper_embeds = np.load(os.path.join(curr_dir, "data/graph/citing_trained_embeds.npy"))
    with open(os.path.join(curr_dir, "data/dummy/paper.json")) as f:
        papers = json.load(f)
    with open(os.path.join(curr_dir, "data/dummy/person.json")) as f:
        people = json.load(f)
    
    embs = []
    if hashtag:
        embs.append(text_embed(hashtag))
    if len(paper_ids) != 0:
        for id in paper_ids:
            embs.append(paper_embeds[id])
    emb = np.mean(np.stack(embs, axis=0), axis=0)
    
    cos_sim = cosine_sim(emb, paper_embeds)[0]
    sorted_idxs = np.argsort(cos_sim)[::-1][:10]
    sorted_papers = [papers[idx] for idx in sorted_idxs]

    recommended_name = set()
    for paper in sorted_papers:
        name = paper["author"][0]
        recommended_name.add(name)
        if len(recommended_name) == 4:
            break
    
    recommended_people = []
    for name in recommended_name:
        for person in people:
            if person["name"] == name:
                break
        recommended_people.append(person)
    return recommended_people


if __name__ == "__main__":
    args = parse_args()
    device = "cuda" if torch.cuda.is_available() else "cpu"

    # seed setting
    set_seed(args.seed)

    # train lightgcn
    if args.mode == "train_lightgcn":
        dataset = PaperGraph(args.data_path, args.data_mode)
        model = LightGCN(dataset.embeds, dataset.norm_adj, num_layers=args.num_layers).to(device)
        optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)
        lr_scheduler = torch.optim.lr_scheduler.LinearLR(optimizer, 1.0, 0.0, total_iters=args.num_epochs)

        train_lightgcn(model, dataset, optimizer, lr_scheduler, args)
    
    # recommend paper & people
    elif args.mode == "recommend":
        """
        info = {
            "hashtag": ["Weight"],
            "paper_ids": [0,1,2]
        }
        for person in recommend_people(info):
            print(f"Name: {person['name']}")
            print(f"Keyword: {', '.join(person['hashtag'])}")
        """

        """
        info = {
            "text": "LLM"
        }
        recommended_papers = recommend_papers(info)
        for paper in recommended_papers:
            print(f"{paper['title']}")

        """
        
        """
        with open("data/dummy/paper.json") as f:
            papers = json.load(f)
        with open("data/dummy/person.json") as f:
            people = json.load(f)
        embeds = np.load("data/graph/citing_trained_embeds.npy")

        for data in papers:
            if data["title"] == args.paper:
                idx = data["id"]
                break
            raise Exception("there is no paper in dataset!")
        paper_embed = embeds[idx][None,:]

        recommended_people = recommend_people(paper_embed, embeds, papers, people, args.topk)
        for person in recommended_people:
            print(f"Name: {person['name']}")
            print(f"Keyword: {', '.join(person['hashtag'])}")
            print("==================")
        """

