package com.netflix.api.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import com.netflix.api.entity.Content;

@Repository
public class ContentRepository {
	
	private final List<Content> store = new ArrayList<>();
	
	public Content save(Content content) {
		store.add(content);
		return content;
	}
	
	public List<Content> findAll() {
		return List.copyOf(store);
	}
	
	public Optional<Content> findById(Integer id) {
		return store.stream()
				.filter(n -> n.getId() == id)
				.findAny();
	}
	
	

}
