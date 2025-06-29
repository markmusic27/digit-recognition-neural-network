import matplotlib.pyplot as plt
from utils.data_loader import load_data, visualize

a, b, c, d = load_data()

visualize(a[0], b[0])