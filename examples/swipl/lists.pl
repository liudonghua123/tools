% List Operations Example
% Length of a list
list_length([], 0).
list_length([_|T], N) :-
    list_length(T, N1),
    N is N1 + 1.

% Append two lists
append([], L, L).
append([H|T], L, [H|R]) :-
    append(T, L, R).

% Reverse a list
reverse([], []).
reverse([H|T], R) :-
    reverse(T, RT),
    append(RT, [H], R).

% Query examples:
% ?- list_length([1,2,3,4], N).
% ?- append([1,2], [3,4], X).
% ?- reverse([1,2,3], X).