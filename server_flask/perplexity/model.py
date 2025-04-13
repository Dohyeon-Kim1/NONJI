import torch
import torch.nn as nn


# simple LightGCN
class LightGCN(nn.Module):
    def __init__(self, embeds, norm_adj, num_layers=4):
        super(LightGCN, self).__init__()
        self.num_nodes = embeds.size(0)
        self.emb_dim = embeds.size(1)
        self.num_layers = num_layers

        self.embeds = nn.Parameter(embeds)
        self.register_buffer("norm_adj", norm_adj.detach())
        
    def forward(self):
        x = self.embeds
        embeds_list = [x]
        for _ in range(self.num_layers):
            x = torch.sparse.mm(self.norm_adj, x)
            embeds_list.append(x)
        
        final_embeds = torch.mean(torch.stack(embeds_list, dim=0), dim=0)
        return final_embeds


# SPECTER2
class SPECTER2():
    def __init__(self):
        pass

    @torch.no_grad()
    def embed(self, text):
        pass