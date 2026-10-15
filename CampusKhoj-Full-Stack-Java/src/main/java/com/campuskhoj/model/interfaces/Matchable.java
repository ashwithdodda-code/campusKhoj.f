package com.campuskhoj.model.interfaces;

import com.campuskhoj.model.Item;

/**
 * Interface representing matchable capability.
 * As defined in PPT Slide 6 & 7: "Matchable is a contract implemented by LostItem,
 * so match logic can be swapped or extended."
 */
public interface Matchable {
    int matchScore(Item other);
}
