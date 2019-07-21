class Backtrack:
    def __init__(self, get_candidates):
        self.get_candidates = get_candidates
        
    def solve_recursive(self, initial, depth):
        if depth == 0:
            return initial
        else:
            candidates = self.get_candidates(initial)
            
            for candidate in candidates:
                solution = self.solve(candidate, depth - 1)
                if solution != None:
                    return solution
            return None
        
    def solve_mult(self, initial, max_depth, eliminated=None):
        tree = [initial]
        
        depth = 0
        while True:            
            if len(tree[depth]) == 0:
                if eliminated is not None:
                    eliminated(tree[depth][0])
                del tree[depth]
                depth = depth - 1
                del tree[depth][0]
            else:
                this = tree[depth][0]

                if depth == max_depth:
                    return this
                
                children = self.get_candidates(this)
                
                depth = depth + 1
                tree.append(children)
                
    def solve(self, initial, max_depth, eliminated=None):
        tree = [[initial]]
        
        depth = 0
        while True:            
            if len(tree[depth]) == 0:
                del tree[depth]
                
                depth = depth - 1
                
                if eliminated is not None:
                    eliminated(tree[depth][0])
                    
                del tree[depth][0]
            else:
                this = tree[depth][0]

                if depth == max_depth:
                    return this
                
                children = self.get_candidates(this)
                
                depth = depth + 1
                tree.append(children)