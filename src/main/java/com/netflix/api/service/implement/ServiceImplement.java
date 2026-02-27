package com.netflix.api.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import com.netflix.api.dto.ContentDTO;
import com.netflix.api.entity.Content;
import com.netflix.api.mapping.MapContentDto;
import com.netflix.api.repository.ContentRepository;
import com.netflix.api.service.ContentService;

@Service
public class ServiceImplement implements ContentService {
	
	private ContentRepository repo;
	
	private MapContentDto map;
	
	public ServiceImplement() {
		repo = new ContentRepository();
		map = new MapContentDto();
	}

	@Override
	public ContentDTO addContent(ContentDTO contentDto) {
		Content newContent = repo.save(map.dtoToContent(contentDto));
		return map.contentToDto(newContent);
	}

	@Override
	public List<ContentDTO> getContents() {
		List<Content> content = repo.findAll();
		List<ContentDTO> contentDto = content.stream()
				.map(c -> map.contentToDto(c))
				.toList();
		return contentDto;
	}

	@Override
	public ContentDTO getContentByName(String name) {
		Content content = repo.findByName(name).get();
		return map.contentToDto(content);
	}


}
