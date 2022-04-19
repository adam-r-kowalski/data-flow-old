[ ] - Move renderer and scene into single data structure

  This will enable the scene to measure the width and height of text and do proper layout calculations
 
[ ] - Seperate data into nodes and edges to properly model a graph based data structure

[ ] - Use dependency injection to provide a gl and text canvas context to engine

  This will enable unit testing as you will not need an actual canvas when rendering
 
[ ] - Add unit tests to show proper geometry is added when a node is added

[ ] - Create edges between outputs of one node and inputs of another node

[ ] - A single output should be able to connect to multiple inputs of other nodes

[ ] - Table sources should have actual data backing all their columns

[ ] - String sources should show a preview of the string literal that they hold

[ ] - Equality nodes should be vectorized and work on scaler and vector comparisons
